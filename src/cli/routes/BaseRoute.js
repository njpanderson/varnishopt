const boxen = require('boxen');
// const crypto = require('crypto');

const BaseCLI = require('../BaseCLI');
const routes = require('./routes');
const questions = require('../../lib/questions');
const i18n = require('../../lang/i18n');

class BaseRoute extends BaseCLI {
	constructor(options) {
		super();

		this.processPointAnswer = this.processPointAnswer.bind(this);

		this.options = Object.assign({}, {
			onComplete: null
		}, options);

		if (!routes[this.options.procName]) {
			throw new Error(
				`Route for process "${this.options.procName}" not found.`
			);
		}

		this.route = routes[this.options.procName];

		// Generate maps within the route
		this.generateRouteMap(this.route);

		/**
		 * @description
		 * Map of the current position within the active route.
		 * Each array element denotes a level and the index within that level.
		 * I.e. [0, 1] = Level 1: 1st item, Level 2: 2nd item.
		 * I.e. [1, 0, 2] = Level 1: 2nd item, Level 2: 1st item, Level 3: 3rd item.
		 * Managed by #getNextIndex
		 */
		// this.indices = [0];
	}

	start() {
		return new Promise((resolve, reject) => {
			this.clear();
			this.writeHead(this.options.procName);

			// Ask about launching from an existing template or creating an option set
			// using the defined process route
			this.prompt(questions.make_method)
				.then((answer) => {
					if (answer.make_method === 'template') {
						// TODO: template route
					} else if (answer.make_method === 'options') {
						// Show the first route point
						this.showRoutePoint(this.route[0])
							.then(this.processPointAnswer);
					}
				})
				.catch(reject);
		});
	}

	/**
	 * Shows a single route point's interface.
	 * @param {object} point - The route point to show.
	 */
	showRoutePoint(point) {
		return new Promise((resolve, reject) => {
			this.pointIsValid(point)
				.then(() => {
					this.clear();
					this.writeHead(
						this.options.procName +
						' ' +
						this.convertAnswersToArgs(this.answers).join(' ')
					);

					if (point.description) {
						this.write(i18n.t(point.description));
					}

					if (point.reference) {
						this.getReferenceFile(point.reference)
							.then((contents) => {
								this.write(boxen(
									contents,
									this.boxenOpts.reference
								));

								this.showRoutePrompt(point, resolve, reject);
							})
							.catch((error) => {
								reject(error);
							});
					} else {
						// Show the point using the local resolve/reject
						this.showRoutePrompt(point, resolve, reject);
					}
				})
				.catch(() => {
					// If the point isn't valid for showing, immediately resolve
					return resolve({ point });
				});
		});
	}

	/**
	 * Show a single route point prompt
	 * @param {object} point - The point to show.
	 * @param {function} resolve - Resolver
	 * @param {function} reject - Rejecter
	 */
	showRoutePrompt(point, resolve, reject) {
		this.promptPoint(point)
			.then((answers) => {
				resolve({ point, answers });
			})
			.catch(reject);
	}

	/**
	 * Get the next route point from the current routing file.
	 * @param {object} point - Current point.
	 * @param {string} divergence - Divergence factor.
	 */
	getNextRoutePoint(point, divergence) {
		let nextPointIndex, a, branchLength,
			branch = this.route;

		if (point.routes && point.routes[divergence]) {
			// Use point from route divergence factor
			return point.routes[divergence][0];
		}

		nextPointIndex = (point.map[point.map.length - 1].index + 1);

		if (point.map.length <= 1 && branch.length > nextPointIndex) {
			// Map is 1 level deep - just return the top level branch
			return branch[nextPointIndex];
		} else {
			// Loop backwards through the map finding a gap
			for (a = (point.map.length - 1); a >= 0; a -= 1) {
				if (Array.isArray(point.map[a])) {
					// Waypoint is a divergence marker
					branch = point.map[a][1].branch;
					branchLength = point.map[a][1].length;
					nextPointIndex = (point.map[a][1].index + 1);
				} else {
					branch = point.map[a].branch;
					branchLength = point.map[a].length;
					nextPointIndex = (point.map[a].index + 1);
				}

				if (branchLength > nextPointIndex) {
					return branch[nextPointIndex];
				}
			}
		}

		return null;
	}

	pointIsValid(point) {
		return new Promise((resolve, reject) => {
			let valid = true;

			this.checkVersion(point.version)
				.then((test) => {
					valid = !test.satisfies ? false : valid;
				})
				.then(() => {
					if (valid) {
						resolve();
					} else {
						reject();
					}
				});
		});
	}

	/**
	 * Returns a route branch given a map
	 * @param {array} map - Map to search with
	 */
	// TODO: add an offset and turn into a possibly useful method?
	getRouteBranch(map) {
		let branch = this.route;

		if (map.length <= 1) {
			// Map is 1 level deep - just return the top level branch
			return branch;
		} else {
			// Map is deeper - find the correct route branch
			// by looping through the branches to the lowest level
			// ref: [1, [divergence: 0], [((-divergence2-)): 1]]
			map.forEach((waypoint) => {
				if (Array.isArray(waypoint)) {
					// Waypoint is a divergence marker
					branch = branch.routes[waypoint[0]];
				} else {
					branch = branch[waypoint];
				}
			});

			return branch;
		}
	}

	processPointAnswer(result) {
		let nextPoint, divergence;

		if (result.answers && result.point.routes) {
			// Point has sub-routes, use the answer as the divergence factor
			divergence = result.answers[result.point.question];
		}

		// Get next point in the route
		nextPoint = this.getNextRoutePoint(result.point, divergence);

		if (nextPoint) {
			// Show the next point
			this.showRoutePoint(nextPoint)
				.then(this.processPointAnswer);
		} else {
			// End reached - compile the options and execute the process
			console.log('end');
			if (typeof this.options.onComplete === 'function') {
				this.options.onComplete(this.options.procName, this.answers);
			}
		}
	}

	/**
	 * Generates maps within each route point for simple waypointing during traversal.
	 * @param {object} route - Route data to map.
	 * @param {array} levels - Level cache - (Used internally).
	 */
	generateRouteMap(branch, levels, divergence) {
		let length = branch.length;

		levels = levels || [];

		// Loop through each point in the root
		Object.values(branch).forEach((point, index) => {
			// Give the point an id
			// point.id = this.getPointId(point);

			// Concatenate levels with the current index
			if (divergence) {
				point.map = levels.concat([[divergence, { index, length, branch }]]);
			} else {
				point.map = levels.concat({ index, length, branch });
			}

			if (point.routes) {
				Object.keys(point.routes).forEach((divergence) => {
					// Recurse on the nested route, adding the current level
					this.generateRouteMap(
						point.routes[divergence],
						levels.concat({index, length, branch }),
						divergence
					);
				});
			}
		});
	}

	// getPointId(point) {
	// 	let hash = crypto.createHash('sha256');

	// 	// Stringify and Hash the point
	// 	hash.update(JSON.stringify(point));
	// 	return hash.digest('hex');
	// }

	/**
	 * Launch a process given a launch template.
	 * @param {number} index - nth template to launch.
	 */
	launchTemplate(index) {

	}
};

module.exports = BaseRoute;