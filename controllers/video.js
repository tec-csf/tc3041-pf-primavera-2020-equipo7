const fs = require('fs');
const path = require('path');

const ffmpeg = require('ffmpeg');

const { bucket } = require('../util/gc');
const { processFrame } = require('../util/aws');
const Video = require('../models/Video');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const HttpError = require('../models/HttpError');

// const mongoose = require('mongoose');
// const videosCollection = mongoose.model('video', Video, 'videos');

exports.postVideo = async (req, res, next) => {
	const videoInput = req.files.video;
	const user = req.body.user_id;

	if (!req.files && videoInput.mimetype !== 'video/mp4') {
		return next(new HttpError('No file uploaded, check your format', 422));
	}
	const uploadsPath = path.resolve('uploads');
	if (!fs.existsSync(uploadsPath)) {
		fs.mkdirSync(uploadsPath);
	}
	const filepath = path.join(uploadsPath, videoInput.name);
	try {
		await req.files.video.mv(filepath);
		const v = await new ffmpeg(filepath);

		const video = await new Video({
			user,
			name: videoInput.name,
			metadata: {
				local_link: filepath,
				bucket_link: '',
				video_size: [v.metadata.video.resolution.w, v.metadata.video.resolution.h],
				frame_rate: v.metadata.video.fps,
				duration: v.metadata.duration.seconds
			},
			applied_seconds: 0,
			frames: []
		}).save();

		res.status(200).send({
			video_id: video._id,
			duration: v.metadata.duration.seconds
		});
	} catch (err) {
		next(new HttpError('Error while checking duration of video.', 422));
	}
};
// User uploaded a video
exports.postVideoAnalysis = async (req, res, next) => {
	const user = req.body.user_id;
	const videoId = req.body.video_id;
	const seconds = req.body.seconds;

	const video = await Video.findById(videoId);
	video.applied_seconds = seconds;
	if (video.user !== user) {
		return next(new HttpError('The video does not belong to the specified user.', 403));
	}
	const v = await new ffmpeg(video.metadata.local_link);
	const uploadsPath = path.resolve('uploads');

	//TODO Divide into functions
	v.fnExtractFrameToJPG(uploadsPath, {
		every_n_seconds: seconds,
		file_name: 'video_frame_%s'
	}, async (error, files) => {
		let i = 0;
		for (; i < files.length; i++) {
			try {
				await bucket.upload(files[i], {
					gzip: true,
					metadata: {
						cacheControl: 'public, max-age=31536000'
					}
				});
			} catch (err) {
				return next(new HttpError('Error while uploading file.', 422));
			}

			if (i === 0) {
				video.metadata.bucket_link = `https://storage.googleapis.com/${bucket.name}/${video.name}`;
				continue;
			}
			try {
				const frame = await processFrame(files[i]);
				frame.sequence_id = i;
				video.frames.push(frame);
			} catch (err) {
				return next(new HttpError('Error while processing frame.', 422));
			}

		}
		try {
			await video.save();
			res.status(200).send('Análisis básico');
		} catch (err) {
			next(new HttpError('Error while saving video.', 422));
		}
	});
};

//all of the videos that one user uploaded
exports.getVideos = (req, res) => {
	const user = req.params.user;
	Video.aggregate([
		{
		  '$match': {
			'user': user
		  }
		}
	  ]).exec((err, data) => {
		if (err) {
			console.log(err);
			res.status(404).send({ error: 'No videos found. try another username.' });
		}
		res.send(data);
	});
};

//getting specific video
exports.getVideo = (req, res) => {
	id = ObjectId(req.params.id);
	console.log(id);
	Video.aggregate([
		{
		  '$match': {
			'_id': id
		  }
		}, {
		  '$addFields': {
			'no_faces': {
			  '$multiply': [
				{
				  '$size': '$frames'
				}, 14
			  ]
			}
		  }
		}, {
		  '$unwind': {
			'path': '$frames'
		  }
		}, {
		  '$unwind': {
			'path': '$frames.analysis'
		  }
		}, {
		  '$addFields': {
			'pred_emot': {
			  '$max': '$frames.analysis.Emotions.Confidence'
			}
		  }
		}, {
		  '$project': {
			'metadata.duration': 1, 
			'no_faces': 1, 
			'pred_emot': 1
		  }
		}
	  ]).exec((err, data) => {
		if (err) {
			console.log(err);
			res.status(404).send({ error: 'No video matches that id' });
		}
		res.send(data);
	});
};
