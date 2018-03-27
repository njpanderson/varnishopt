const os = require('os');
const inquirer = require('inquirer');
const semver = require('semver');
const boxen = require('boxen');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const exec = require('child_process').exec;

const questions = require('../lib/questions');
const constants = require('../lib/constants');
const utils = require('../lib/utils');
const i18n = require('../lang/i18n');

class BaseCLI {
	constructor() {
		// TODO: does this even work?
		// this.BottomBar = new inquirer.ui.BottomBar();
		this.boxenOpts = {
			header: {
				padding: 1,
				margin: 1,
				borderStyle: 'round',
				dimBorder: true,
				float: 'center',
				align: 'center'
			},
			reference: {
				padding: 1,
				margin: 0,
				borderStyle: 'classic',
				dimBorder: true,
				float: 'center',
				align: 'left'
			}
		}

		this.globOptions = {
			cwd: path.dirname(__dirname),
			absolute: true
		};

		this.varnishVersion = null;
		this.answers = [];
	}

	/**
	 * Clear the CLI and reset the cursor.
	 */
	clear() {
		process.stdout.write('\x1B[2J\x1B[0f');
	}

	/**
	 * Write a single message to the console as a header.
	 * @param {string} message - Message to write (in addition to the standard header).
	 */
	writeHead(message) {
		this.write(
			boxen(
				i18n.t('welcome') + os.EOL +
				(message ?
					os.EOL + this.nl(message) :
					i18n.t('datetime', chalk.bold.blue((new Date()).toString()))
				),
				this.boxenOpts.header
			)
		);
	}

	/**
	 * Write a single message to the console.
	 * @param {string} message - Message to write.
	 * @param {boolean} [newline = true] - Whether to enter a newline character at the end.
	 */
	write(message, newline = true) {
		process.stdout.write(message + (newline ? os.EOL : '\0'));
	}

	writeStatus(message) {
		this.BottomBar.updateBottomBar(message);
	}

	/**
	 * Trims a text string into a specified column length and maximum line length.
	 * @param {string} text - Text to cut into NL separated chunks.
	 * @param {number} [cols=80] - Number of column characters at which to chunk.
	 * @param {number} [lines=3] - Number of lines at which to end. Use 0 for unlimited lines.
	 */
	nl(text, cols = 80, lines = 3) {
		let nextWord, maxColsReached, a, b,
			result = [],
			colCount = 0;

		if (text.length <= cols) {
			return text;
		}

		text = text.split(' ');
		result.push('');
		b = 0;

		// Loop through every "word", adding it to a column-safe array
		for (a = 0; a < text.length; a += 1) {
			nextWord = (text.length > (a + 1)) ? text[a + 1] + ' ' : '';
			colCount = result[result.length - 1].length;
			maxColsReached = (colCount + nextWord.length) > cols;

			// Maximum number of columns reached
			if (maxColsReached) {
				// Maximum number of lines AND columns reached
				if (lines > 0 && result.length === lines) {
					break;
				}

				result.push('');
			}

			// Add the word to the current last line
			result[result.length - 1] += nextWord;
		}

		return result.join(os.EOL);
	}

	/**
	 * Ask the user a question using inquirer.
	 * @param {object} question - Question object, from the questions.js file
	 */
	prompt(question) {
		if (!question.name) {
			throw new Error('Missing .name property. Cannot send unnamed question to prompt().');
		}

		// Use inquirer to ask the question
		return inquirer.prompt(question);
	}

	promptPoint(point) {
		let question = questions[point.question];

		return this.prompt(question)
			.then((answer) => {
				// Save it to a global property
				this.answers.push({ question, point, answer });

				return answer;
			});
	}

	/**
	 * @description
	 * Converts a set of answers provided by the CLI into a process arguments
	 * object.
	 * @param {object} answers - Answers as given from BaseRoute.
	 */
	convertAnswersToArgs(answers) {
		let args = [];

		answers.forEach((answer) => {
			let answerValue = answer.answer[answer.question.name],
				argValue = answer.point.args;

			if (typeof answer.point.args === 'object') {
				// Args is an object - use the answer to select a key
				argValue = answer.point.args[answerValue];
			}

			if (argValue) {
				// Replace argValue placeholders with specific values
				argValue = argValue.replace('$1', utils.escapeArgValue(answerValue));

				args.push(argValue);
			}
		});

		return args;
	}

	/**
	 * @description
	 * Attempts to find a reference text file and return it.
	 * Will use the current language, falling back to en_gb.
	 * @param {string} name - Name of the reference file (before any extension)
	 */
	getReferenceFile(name) {
		// TODO: make this work!
		return new Promise((resolve, reject) => {
			glob(
				`lang/reference/${i18n.locale}/${name}.*`,
				this.globOptions,
				(error, files) => {
					let contents;

					if (error) {
						reject(error);
					}

					if (files.length > 0) {
						if (!(contents = fs.readFileSync(files[0], 'UTF-8'))) {
							reject(`File "${files[0]}" could not be read.`);
						}
					} else {
						reject(`Reference file for "${i18n.locale}/${name}" could not be found.`)
					}

					resolve(contents);
				}
			);
		});
	}

	/**
	 * @description
	 * Test whether the currently installed version of Varnish is equal to or
	 * greater than the version supplied.
	 * @param {string} version - Minimum version to require
	 */
	checkVersion(version) {
		if (!version) {
			version = `>=${constants.cli.MIN_VARNISH_VERSION}`;
		}

		return this.getVarnishVersion(this.varnishVersion)
			.then((varnishVersion) => {
				this.varnishVersion = varnishVersion;

				return {
					varnishVersion: this.varnishVersion,
					satisfies: semver.satisfies(this.varnishVersion, version)
				};
			});
	}

	/**
	 * Retrieves the current version of Varnish within the installed environment.
	 */
	getVarnishVersion(version) {
		return new Promise((resolve, reject) => {
			if (version) {
				return resolve(version);
			}

			// Get version from varnishd
			exec('varnishd -V', (error, stdout, stderr) => {
				let match;

				if (error) {
					reject(i18n.t('could_not_get_version'));
				}

				// Version data comes from stderr... Which is odd, but I'm sure
				// there are reasons.
				match = stderr.match(/varnish-(\d+\.\d+\.\d+)\s/);

				if (match !== null) {
					// Resolve to version match
					resolve(match[1]);
				} else {
					reject(i18n.t('could_not_get_version'));
				}
			});
		});
	}
}

module.exports = BaseCLI;