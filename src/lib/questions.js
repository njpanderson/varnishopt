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
	},

	make_method: {
		type: 'list',
		name: 'make_method',
		message: i18n.t('template_or_optionsset'),
		default: 'template',
		choices: [
			{ name: i18n.t('use_template'), value: 'template' },
			{ name: i18n.t('create_options_set'), value: 'options' }
		]
	},

	request_type: {
		type: 'list',
		name: 'request_type',
		message: i18n.t('type_of_requests'),
		default: 'both',
		choices: [
			{ name: i18n.t('type_all_requests'), value: 'both' },
			{ name: i18n.t('type_client_requests'), value: 'client' },
			{ name: i18n.t('type_backend_requests'), value: 'backend' }
		]
	},

	filter_query_route: {
		type: 'list',
		name: 'filter_query_route',
		message: i18n.t('filter_query_route'),
		default: 'list',
		choices: [
			{ name: i18n.t('query_from_list'), value: 'filter_query_list' },
			{ name: i18n.t('query_manual'), value: 'filter_query_manual' },
		]
	},

	filter_query_list: {
		type: 'list',
		name: 'filter_query_list',
		message: i18n.t('filter_query_list'),
		default: 'list',
		choices: [
			{ name: '(fill in from data file!)', value: '-' },
		]
	},

	filter_query: {
		type: 'input',
		name: 'filter_query',
		message: i18n.t('filter_query')
	},

	test: {
		type: 'input',
		name: 'test',
		message: 'Just a test question:'
	},

	test2: {
		type: 'input',
		name: 'test2',
		message: 'Test question #2:'
	}
};