const AWS = require('aws-sdk');
const fs = require('fs');
const HttpError = require('../models/HttpError');
const mongoose = require('mongoose');
const path = require('path');
const ffmpeg = require('ffmpeg');
const { bucket } = require('../util/gc');

// User uploaded a video
exports.postVideo = async (req, res) => {
	const video = req.files.video;
	const fps = req.body.fps;
	if (!req.files && video.mimetype !== 'video/mp4') {
		return next(new HttpError('No file uploaded, check your format', 422));
	}
	const filepath = path.join(__dirname, '..', 'uploads', req.files.video.name);//TODO Change to mongo id
	req.files.video.mv(filepath)
	try {
		const v = await new ffmpeg(filepath);
		console.log(v.metadata);
		v.fnExtractFrameToJPG(path.join(__dirname, '..', 'uploads'), {
			frame_rate: Number(fps),
			file_name: 'video_frame_%s'
		}, function (error, files) {
			console.log(files);
			let fi
			for (file of files) {


			const config = new AWS.Config({
				accessKeyId: process.env.AWS_ACCESS_KEY_ID_NODE,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_NODE,
				region: process.env.AWS_REGION
			});
			const client = new AWS.Rekognition(config);

			try {
				const image = fs.readFileSync(photo, {encoding: 'base64'});
				const params = {
					Image: {
						Bytes: new Buffer(image, 'base64'),
				},
				Attributes: ['ALL']
			};

			// "HAPPY";
			// "SAD";
			// "ANGRY";
			// "CONFUSED";
			// "DISGUSTED";
			// "SURPRISED";
			// "CALM";
			// "UNKNOWN";
			// "FEAR"

	client.detectFaces(params, function (err, response) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log(`Detected faces for: ${photo}`);
			response.FaceDetails.forEach(data => {
				let low = data.AgeRange.Low;
				let high = data.AgeRange.High;
				console.log(`The detected face is between: ${low} and ${high} years old`);

				console.log(` ${data.Emotions[0].Type}:${data.Emotions[0].Confidence}`);
				console.log(` ${data.Emotions[1].Type}:${data.Emotions[1].Confidence}`);
				console.log(` ${data.Emotions[2].Type}:${data.Emotions[2].Confidence}`);
				console.log(` ${data.Emotions[3].Type}:${data.Emotions[3].Confidence}`);
				console.log(` ${data.Emotions[4].Type}:${data.Emotions[4].Confidence}`);
				console.log(` ${data.Emotions[5].Type}:${data.Emotions[5].Confidence}`);
				console.log(` ${data.Emotions[6].Type}:${data.Emotions[6].Confidence}`);
				console.log(` ${data.Emotions[7].Type}:${data.Emotions[7].Confidence}`);
				// console.log(` ${data.Emotions[8].Type}:${data.Emotions[0].Confidence}`);

			});
		}
	});
} catch (error) {
	console.log(error);
}

				const result = await bucket.upload(file, {
					gzip: true,
					metadata: {
						cacheControl: 'public, max-age=31536000'
					}
				})
				if (result) {
					console.log(result);
					res.status(200).send('Image uploaded successfully');
				} else {
					return next(new HttpError('Image could not be uploaded', 422));
				}
				return res.status(200).send('Successfully processed video');
			}
		});
 
	} catch (errtl){
		if (errortl) {
			console.log(errortl);
			return next(new HttpError('Image could not be uploaded', 422));
		}
	}
};

//all of the videos that one user uploaded
exports.getVideos = (req, res) => {

};

//getting specific video
exports.getVideo = (req, res) => {
		
};
