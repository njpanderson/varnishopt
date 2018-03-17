const inquirer = require('inquirer');
const chalk = require('chalk');

const BaseCLI = require('./BaseCLI');
const questions = require('../lib/questions');
const router = require('./routes/router');
const i18n = require('../lang/i18n');

class Main extends BaseCLI {
	start() {
		this.write(i18n.t('welcome', chalk.yellow('varnishopt')));

		// First, get the main route...
		inquirer.prompt(questions.route)
			.then((answer) => {
				// ... Then, load the required router class
				const route = new router[answer.route]();
				route.start();
			});
	}
};

module.exports = (new Main());