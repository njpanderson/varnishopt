/**
 * App class
 */
class App {
	constructor() {
		// App constructor
	}

	/**
	 * Generate a process command options string given options.
	 * @param {object} options - Options object - key/value pairs of option names
	 * and their optional values.
	 */
	generateCommandOptions(options) {
		console.log('generateCommandOptions()');
		options.forEach((option) => {
			console.log(`option: ${option}`);
		});

		return options.join(' ');
	}

	/**
	 * Launch a process given options.
	 * @param {string} procName - Name of the process to launch.
	 * @param {string|array} options - Options string or array of options.
	 */
	launchCommand(procName, options) {
		if (Array.isArray(options)) {
			options = this.generateCommandOptions(options);
		}

		console.log(`${procName} ${options}`);
	}
};

module.exports = App;