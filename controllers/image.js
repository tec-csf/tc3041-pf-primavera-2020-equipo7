const HttpError = require('../models/HttpError');
const { validationResult } = require('express-validator');
const path = require('path');
//const Image = require('../models/images');
const { bucket } = require('../util/gc');

exports.postImage = async (req, res, next) => {
	const image = req.files.image;
	if (!req.files && image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
		return next(new HttpError('No file uploaded', 422));
	}
	const filepath = path.join(__dirname, '..', 'uploads', req.files.image.name);//TODO Change to mongo id
	req.files.image
		.mv(filepath)
		.then((ans) => {
			console.log(ans);
			bucket
				.upload(filepath, {
					gzip: true,
					metadata: {
						cacheControl: 'public, max-age=31536000'
					}
				})
				.then((result) => {
					if (result) {
						console.log(result);
						res.status(200).send('Image uploaded successfully');
					} else {
						return next(new HttpError('Image could not be uploaded', 422));
					}
				})
				.catch((err) => {
					console.log('Err uploading image', err);
					res.status(500).send(err);
				});
		})
		.catch((errtl) => {
			if (errortl) {
				console.log(errortl);
				return next(new HttpError('Image could not be uploaded', 422));
			}
		});
};

exports.getImages = function(req, res, next) {
	console.log('retrieving uploaded images');

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log('req.file', req.file);
	} catch (_) {
		return next(new HttpError('No image uploaded', 404));
	}

	if (!req.file) {
		res.status(400).send('No file found in body.');
		return;
	}
};
