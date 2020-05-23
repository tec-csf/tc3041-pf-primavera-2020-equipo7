const fs = require('fs');
const path = require('path');

const aws = require('aws-sdk');
const ffmpeg = require('ffmpeg');

const { bucket } = require('../util/gc');
const { AWS_ACCESS_KEY_ID_NODE, AWS_SECRET_ACCESS_KEY_NODE, AWS_REGION } = require('../config/secrets');
const Video = require('../models/Video');
const { Frame } = require('../models/Frame');
const HttpError = require('../models/HttpError');

// User uploaded a video
exports.postVideo = async (req, res, next) => {
	const videoInput = req.files.video;
	const seconds = req.body.seconds;
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
			user: req.body.id,
			name: videoInput.name,
			metadata: {
				bucket_link: `https://storage.googleapis.com/${bucket.name}/${videoInput.name}}`,
				video_size: [v.metadata.video.resolution.w, v.metadata.video.resolution.h],
				frame_rate: v.metadata.video.fps,
				duration: v.metadata.duration.seconds
			},
			applied_seconds: seconds,
			frames: []
		});
		//TODO Divide into functions
		v.fnExtractFrameToJPG(uploadsPath, {
			every_n_seconds: seconds,
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
					const filePathArray = files[i].split('/');
					const frame = new Frame({
						name: `https://storage.googleapis.com/${bucket.name}/${filePathArray[filePathArray.length - 1]}}`,
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
			let k = 0;
			for (; k < files.length; k++) {
				const result = await bucket.upload(files[k], {
					gzip: true,
					metadata: {
						cacheControl: 'public, max-age=31536000'
					}
				});
			};
			video.save().then(() => {
				res.status(200).send('Análisis básico');
			}).catch(err => {
				next(new HttpError('Error while saving video.', 422));
			});
		});

	} catch (err) {
		if (err) {
			console.log(err);
			return next(new HttpError('Video could not be uploaded', 422));
		}
	}
};

//all of the videos that one user uploaded
exports.getVideos = (req, res) => {

};

//getting specific video
exports.getVideo = (req, res) => {

};
