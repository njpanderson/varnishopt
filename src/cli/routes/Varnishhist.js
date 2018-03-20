const BaseRoute = require('./BaseRoute');

class Varnishhist extends BaseRoute {
	constructor() {
		super({
			procName: 'varnishhist'
		});
	}
};

module.exports = Varnishhist;