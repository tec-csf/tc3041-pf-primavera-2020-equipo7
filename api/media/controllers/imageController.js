const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const imageSchema = require('../models/images');
// const ObjectId = mongoose.Types.ObjectId;

// const mongoose = require('mongoose');
// const imageCollection = mongoose.model('image', userSchema, 'images');
const {Storage} = require('@google-cloud/storage');
const path = require('path');
//necessary?
// const Multer = require('multer');
// const multer = Multer({
// 	storage: Multer.memoryStorage(),
// 	limits: {
// 	  fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
// 	}
//   });

 //setting Google Cloud Storage credentials
 const gc = new Storage({
	keyFilename: path.join(__dirname, '/../emotionfy-media-277519-034f3305fd00.json'),
	projectId: 'emotionfy-media-277519'
});

const videosBucket = gc.bucket('staging.emotionfy-media-277519.appspot.com');

// gc.getBuckets().then(x => console.log(x)); //dev purposes only

// Create new image from a video or a single frame
exports.image_upload = function (req, res, next) {
	console.log('Adding a new image to the bucket...');
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
		res.status(400).send('No file uploaded.');
		return;
	}

	const blob = videosBucket.file(req.file.filename);
	const blobStream = blob.createWriteStream();
	
	blobStream.on('error', (err) => {
		next(err);
		return;
	  });

	  blobStream.on('finish', () => {
		res.status(200).send('The image has been successfully uploaded to google cloud storage');
	  });
	
	  blobStream.end(req.file.buffer);
};
