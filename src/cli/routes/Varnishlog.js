const BaseRoute = require('./BaseRoute');

class Varnishlog extends BaseRoute {
	constructor() {
		super({
			procName: 'varnishlog'
		});
	}
};

module.exports = Varnishlog;