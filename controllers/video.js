const fs = require('fs');
const path = require('path');

const aws = require('aws-sdk');
const mongoose = require('mongoose');
const ffmpeg = require('ffmpeg');

const { bucket } = require('../util/gc');
const { AWS_ACCESS_KEY_ID_NODE, AWS_SECRET_ACCESS_KEY_NODE, AWS_REGION } = require('../config/secrets');
const Video = require('../models/Video');
const { Frame } = require('../models/Frame');
const HttpError = require('../models/HttpError');

// User uploaded a video
exports.postVideo = async (req, res, next) => {
	const videoInput = req.files.video;
	const fps = req.body.fps;
	if (!req.files && videoInput.mimetype !== 'video/mp4') {
		return next(new HttpError('No file uploaded, check your format', 422));
	}
	const uploadsPath = path.resolve('uploads');
	if (!fs.existsSync(uploadsPath)) {
		fs.mkdirSync(uploadsPath);
	}
	const filepath = path.join(uploadsPath, videoInput.name);
	await req.files.video.mv(filepath);
	try {
		const v = await new ffmpeg(filepath);
		const video = await new Video({
			metadata: {
				bucket_link: '',
				video_size: [v.metadata.video.resolution.w, v.metadata.video.resolution.h],
				frame_rate: v.metadata.video.fps,
				duration: v.metadata.duration.seconds
			},
			applied_fr: fps,
			frames: []
		});
		//TODO Divide into functions
		v.fnExtractFrameToJPG(uploadsPath, {
			frame_rate: Number(fps),
			file_name: 'video_frame_%s'
		}, async (error, files) => {
			const config = new aws.Config({
				accessKeyId: AWS_ACCESS_KEY_ID_NODE,
				secretAccessKey: AWS_SECRET_ACCESS_KEY_NODE,
				region: AWS_REGION
			});
			const client = new aws.Rekognition(config);
			let i = 0;
			for (; i < files.length; i++) {
				if (i === 0) {
					continue;
				}
				try {
					const image = fs.readFileSync(files[i], { encoding: 'base64' });
					const params = {
						Image: {
							Bytes: Buffer.from(image, 'base64'),
						},
						Attributes: ['ALL']
					};
					const result = await client.detectFaces(params).promise();
					console.log(v.metadata);
					console.log(result);

					const frame = new Frame({
						path: files[i],
						instant: 0,
						sequence_id: i,
						bucket_link: '',
						analysis: []
					});
					let j = 0;
					for (; j < result.FaceDetails.length; j++) {
						frame.analysis.push(result.FaceDetails[j]);
					}
					video.frames.push(frame);
				} catch (error) {
					console.log(error);
					return next(new HttpError('Video could not be processed', 422));
				}
			};
			video.save();
			// let k = 0;
			// for (; k < files.length; k++) {
			// 	const result = await bucket.upload(files[k], {
			// 		gzip: true,
			// 		metadata: {
			// 			cacheControl: 'public, max-age=31536000'
			// 		}
			// 	});
			// 	//TODO Fix reference to bucket_link
			// 	if (k === 0) {
			// 		video.metadata.bucket_link = result.bucket_link;
			// 	} else {
			// 		video.frames[k - 1].bucket_link = result.bucket_link;
			// 	}
			// };
			res.status(200).send('Análisis básico');
		});

	} catch (err) {
		if (err) {
			console.log(err);
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
