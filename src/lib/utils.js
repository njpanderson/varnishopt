module.exports = {
	/**
	 * Escape a (Unix) argument value so it can be safely used within an argument string.
	 * @param {string} value - The value to escape.
	 */
	escapeArgValue: (value) => {
		value = value.replace(/"/g, '\\"');
		value = value.replace(/'/g, "\\'");
		return value;
	}
}