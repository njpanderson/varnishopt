const os = require('os');
// const inquirer = require('inquirer');
const boxen = require('boxen');
const chalk = require('chalk');

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
				align: 'center'
			}
		}
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
}

module.exports = BaseCLI;