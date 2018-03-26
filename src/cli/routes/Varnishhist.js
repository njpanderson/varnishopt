const BaseRoute = require('./BaseRoute');

class Varnishhist extends BaseRoute {
	constructor(options) {
		super(Object.assign({}, {
			procName: 'varnishhist'
		}, options));
	}
};

module.exports = Varnishhist;