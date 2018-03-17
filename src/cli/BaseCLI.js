const os = require('os');

class BaseCLI {
	/**
	 * Write a single message to the console.
	 * @param {string} message - Message to write.
	 * @param {boolean} [newline = true] - Whether to enter a newline character at the end.
	 */
	write(message, newline = true) {
		process.stdout.write(message + (newline ? os.EOL : '\0'));
	}
}

module.exports = BaseCLI;