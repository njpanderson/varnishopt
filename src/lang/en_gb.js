const os = require('os');

module.exports = {
	'welcome': 'Welcome to ${1}' + os.EOL +
		'A utility for launching varnish tools with a user-friendly UI.' + os.EOL,
	'no_locale': 'Locale "${1}" does not exist. Has a .js file been created for it?',
	'which_tool_to_launch': 'Firstly, which Varnish tool do you want to launch?',
	'varnishncsa_desc': 'varnishncsa (Logs in NCSA Common log format)',
	'varnishhist_desc': 'varnishhist (A Varnish histogram of activity)',
	'varnishlog_desc': 'varnishlog (Expanded logs, showing full request cycle)',
}