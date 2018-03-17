const i18n = require('../lang/i18n');

module.exports = {
	route: {
		type: 'list',
		name: 'route',
		message: i18n.t('which_tool_to_launch'),
		default: 'varnishncsa',
		choices: [
			{ name: i18n.t('varnishncsa_desc'), value: 'Varnishncsa' },
			{ name: i18n.t('varnishhist_desc'), value: 'Varnishhist' },
			{ name: i18n.t('varnishlog_desc'), value: 'Varnishlog' }
		]
	}
};