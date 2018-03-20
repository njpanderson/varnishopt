const inquirer = require('inquirer');

const App = require('../App');
const BaseCLI = require('./BaseCLI');
const questions = require('../lib/questions');
const router = require('./routes/router');

class Main extends BaseCLI {
	constructor() {
		super();

		this.app = new App();
	}

	start() {
		this.clear();
		this.writeHead();
		// this.writeStatus('varnishopt version ' + process.env.npm_package_version);

		// First, get the main route...
		inquirer.prompt(questions.route)
			.then((answer) => {
				// ... Then, load the required router class
				const route = new router[answer.route]();
				route.start()
					.then(this.app.run);
			});
	}
};

module.exports = (new Main());