module.exports = {
	/**
	 * Returns the current config, with any required augmentations made.
	 * @param {string} item - Retrieve a single configuration item
	 */
	get: function (item) {
		let config = Object.assign(
			{
				locale: 'en_gb'
			}
			// TODO: load configuration from a file
		);

		if (item) {
			return config[item] || null;
		}

		return config;
	}
};