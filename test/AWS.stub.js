
module.exports = {
	config: {
		region: null
	},
	Lambda: function() {
		this.listFunctions = function(options, callback) {
			callback(null, { Functions: [] });
		};

		this.createFunction = function(options, callback) {
			callback(null, true);
		}
	}
}
