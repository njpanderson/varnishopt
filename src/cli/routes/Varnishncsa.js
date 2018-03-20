const BaseRoute = require('./BaseRoute');

class Varnishncsa extends BaseRoute {
	constructor() {
		super({
			procName: 'varnishncsa'
		});
	}

	// start() {
	// 	this.write('start Varnishncsa');
	// }
};

module.exports = Varnishncsa;