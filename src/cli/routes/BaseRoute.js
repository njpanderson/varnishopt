const BaseCLI = require('../BaseCLI');

class BaseRoute extends BaseCLI {
	start() {
		throw new Error('Route#start method not defined');
	}
};

module.exports = BaseRoute;