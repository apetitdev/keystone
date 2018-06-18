/*
TODO: Needs Review and Spec
*/

module.exports = {
	getAll: function (req, res) {
		const Bynder = require('@bynder/bynder-js-sdk').default;
		var keystone = req.keystone;
		var bynder = new Bynder({
			consumer: {
			    public: process.env.BYNDER_CONSUMER_PUBLIC,
			    secret: process.env.BYNDER_CONSUMER_SECRET
			},
			accessToken: {
			    public: process.env.BYNDER_ACCESSTOKEN_PUBLIC,
			    secret: process.env.BYNDER_ACCESSTOKEN_SECRET
			},
		    baseURL: "https://plugin.getbynder.com/api/"
		})

		bynder.getMediaList({
			limit: req.query.limit || 10,
			page: req.query.page || 1
		})
		.then((data) => {
			res.json(data);
		})
		.catch((error) => {
			res.json(error);
		});
	},

	getOne: function (req, res) {
		const Bynder = require('@bynder/bynder-js-sdk').default;
		var keystone = req.keystone;
		var bynder = new Bynder({
			consumer: {
			    public: process.env.BYNDER_CONSUMER_PUBLIC,
			    secret: process.env.BYNDER_CONSUMER_SECRET
			},
			accessToken: {
			    public: process.env.BYNDER_ACCESSTOKEN_PUBLIC,
			    secret: process.env.BYNDER_ACCESSTOKEN_SECRET
			},
		    baseURL: "https://plugin.getbynder.com/api/"
		})

		bynder.getMediaList({
			ids: req.params.id,
			limit: 1,
			page: 1
		})
		.then((data) => {
			res.json(data);
		})
		.catch((error) => {
			res.json(error);
		});
	},

	upload: function (req, res) {
		const Bynder = require('@bynder/bynder-js-sdk').default;
		var keystone = req.keystone;
		var bynder = new Bynder({
			consumer: {
			    public: process.env.BYNDER_CONSUMER_PUBLIC,
			    secret: process.env.BYNDER_CONSUMER_SECRET
			},
			accessToken: {
			    public: process.env.BYNDER_ACCESSTOKEN_PUBLIC,
			    secret: process.env.BYNDER_ACCESSTOKEN_SECRET
			},
		    baseURL: "https://plugin.getbynder.com/api/"
		})

		console.log(req.files.file);

		bynder.uploadFile(req.files.file)
		.then((data) => {
			res.json(data);
		})
		.catch((error) => {
			res.json(error);
		});
	},
};
