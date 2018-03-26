const BaseRoute = require('./BaseRoute');

class Varnishncsa extends BaseRoute {
	constructor(options) {
		super(Object.assign({}, {
			procName: 'varnishncsa'
		}, options));
	}

	// start() {
	// 	this.write('start Varnishncsa');
	// }
};

module.exports = Varnishncsa;