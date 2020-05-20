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
		const ans = await req.files.image.mv(filepath)
		try {
			console.log(ans);
			const result = await bucket.upload(filepath, {
					gzip: true,
					metadata: {
						cacheControl: 'public, max-age=31536000'
					}
				});
				
			if (result) {
				console.log(result);
				res.status(200).send('Image uploaded successfully');
			} else {
				return next(new HttpError('Image could not be uploaded', 422));
			}
		} catch(errtl) {
			if (errortl) {
				console.log(errortl);
				return next(new HttpError('Image could not be uploaded', 422));
			}
		};
};

exports.getImage = async (fileName, destination) => {
	// const result = await bucket.file(fileName).download({
	// 	destination
	// });

		// get public url for file
	const getPublicThumbnailUrlForItem = fileName => {
		return `https://storage.googleapis.com/${videosBucket.name}/${fileName}`
		}
	next(new HttpError('Unable to get image url.', 422));
};