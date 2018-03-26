// Generally speaking, route points are selected in a top-down order one by one.
// If a point branches, it will contain a 'route' object — the keys of which
// denote the answer from the previous question and the next set of questions to ask.
// TODO: Once a sub-route is exhausted, the next question in the route above is is then asked
// unless a 'skip' property is found to be true — in which case, the next route 'up'
// is then continued where it left off, or if the tree is at the highest level already
// then the end is reached.
module.exports = {
	// Route (varnishncsa)
	// A list of route points, asked in order, branching off to optional subroutes
	varnishncsa: [
		{
			// Point
			question: 'request_type',
			args: {
				// Args here are based on the answer and relate directly to a proc arg
				both: null,
				client: '-c',
				backend: '-b'
			}
		},
		{
			// Point
			question: 'filter_query_route',
			routes: {
				// Subroutes - the keys of which are based on the answers to the previous question (filter_query_route)
				filter_query_list: [
					// Route (list)
					{
						// Point
						question: 'filter_query_list',
						// Args is single but uses a replacement string for its ultimate value
						// ($1 in this case is just the first result sent back from the question)
						args: '-q \'$1\''
					}
				],
				filter_query_manual: [
					// Route (manual)
					{
						// Point
						question: 'filter_query',
						// The i18n string to show before providing the question
						description: 'filter_query_desc',
						// Shown after the description, inside a boxen box
						reference: 'filter_query',
						args: '-q \'$1\''
					}
				]
			}
		},
		{
			// Point
			question: 'ncsa_format',
			description: 'ncsa_format_desc',
			reference: 'ncsa_format',
			args: '-f \'$1\''
		}
	],
	varnishlog: [
		{
			question: 'request_type'
		}
	],
	varnishhist: [
		{
			question: 'request_type'
		}
	]
}