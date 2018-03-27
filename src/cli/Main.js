const App = require('../App');
const BaseCLI = require('./BaseCLI');
const questions = require('../lib/questions');
const constants = require('../lib/constants');
const router = require('./routes/router');
const i18n = require('../lang/i18n');

class Main extends BaseCLI {
	constructor() {
		super();

		this.runProcess = this.runProcess.bind(this);

		this.app = new App();
	}

	start() {
		this.checkVersion()
			.then((result) => {
				if (!result.satisfies) {
					this.write(i18n.t(
						'varnish_version_to_old',
						result.varnishVersion,
						constants.cli.MIN_VARNISH_VERSION
					))
					process.exit();
				}

				this.clear();
				this.writeHead();
				// this.writeStatus('varnishopt version ' + process.env.npm_package_version);

				// First, get the main route...
				this.prompt(questions.route)
					.then((answer) => {
						// ... Then, load the required router class
						const route = new router[answer.route]({
							onComplete: this.runProcess
						});
						route.start()
							.then(this.app.run);
					});
			})
			.catch((error) => {
				this.write(error);
				process.exit();
			})
	}

	runProcess(procName, answers) {
		this.app.launchCommand(
			procName,
			this.convertAnswersToArgs(answers)
		);
	}
};

module.exports = (new Main());