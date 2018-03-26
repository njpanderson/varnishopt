const App = require('../App');
const BaseCLI = require('./BaseCLI');
const questions = require('../lib/questions');
const router = require('./routes/router');

class Main extends BaseCLI {
	constructor() {
		super();

		this.runProcess = this.runProcess.bind(this);

		this.app = new App();
	}

	start() {
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
	}

	runProcess(procName, answers) {
		this.app.launchCommand(
			procName,
			this.convertAnswersToArgs(answers)
		);
	}
};

module.exports = (new Main());