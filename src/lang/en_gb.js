const os = require('os');

module.exports = {
	'welcome': 'Welcome to c{white:blue: varnishopt }.' + os.EOL +
		'A utility for launching varnish tools with a user-friendly UI.',
	'no_locale': 'Locale "${1}" does not exist. Has a .js file been created for it?',
	'datetime': 'Date/Time: ${1}',
	'which_tool_to_launch': 'Firstly, which Varnish tool do you want to launch?',
	'varnishncsa_desc': 'varnishncsa (Logs in NCSA Common log format)',
	'varnishhist_desc': 'varnishhist (A Varnish histogram of activity)',
	'varnishlog_desc': 'varnishlog (Expanded logs, showing full request cycle)',
	'template_or_optionsset': 'Would you like to load from an existing c{red:Template} or create a new c{yellow:Options set}?',
	'create_options_set': 'Create an options set',
	'use_template': 'Use a template',
	'type_of_requests': 'Which types of requests should be shown?',
	'type_all_requests': 'Show all requests',
	'type_client_requests': 'Show c{red:client} requests only',
	'type_backend_requests': 'Show c{red:backend} requests only',
	'filter_query_route': 'Set the VSL query filter to use (or choose from a list)',
	'query_from_list': 'Choose from a list',
	'query_manual': 'Enter a query',
	'filter_query_list': 'Choose a pre-made query to filter by:',
	'filter_query': 'Enter a filter query:',
	'ncsa_format': 'Enter a display format',
	'varnish_version_to_old': 'The varnish version in this environment (${1}) is too old. Please ensure that Varnish is at least version (${2}) or newer.',
	'could_not_get_version': 'Could not get Varnish version. Is it installed?'
}