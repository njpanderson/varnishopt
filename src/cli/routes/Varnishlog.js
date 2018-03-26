const BaseRoute = require('./BaseRoute');

class Varnishlog extends BaseRoute {
	constructor(options) {
		super(Object.assign({}, {
			procName: 'varnishlog'
		}, options));
	}
};

module.exports = Varnishlog;