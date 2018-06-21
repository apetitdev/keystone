/*
TODO: Needs Review and Spec
*/

const Bynder = require('@bynder/bynder-js-sdk').default
const _ = require('lodash');

const fs = require('fs');

module.exports = {
	getBrand: function(req, res) {
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

		bynder.getBrands()
		.then((data) => {
			res.json(data);
		})
		.catch((error) => {
			res.json(error);
		});
	},

	getAllMedias: function (req, res) {
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

	getOneMedia: function (req, res) {
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
		var file_size = fs.readFileSync(req.files.file.path).length;
		var file = fs.createReadStream(req.files.file.path);

		console.log(bynder);
		bynder.getBrands()
		.then((data) => {
			var brand_id = (_.first(data) || {}).id;
			console.log('we got the brand');
			fileObject = 
				{data: {brandId: brand_id},
				 length: file_size,
				 body: file,
				 filename: req.files.file.originalname};
			bynder.uploadFile(fileObject)
			.then((data) => {
				res.json(data);
			})
			.catch((error) => {
				console.log('we fucked up', error);
				res.json(error);
			});
		})
		.catch((error) => {
			console.log('we really fucked up', error);
			res.json(error);
		});
	},
};
