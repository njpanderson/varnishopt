const BaseRoute = require('./BaseRoute');

class Varnishncsa extends BaseRoute {
	start() {
		this.write('start');
	}
};

module.exports = Varnishncsa;