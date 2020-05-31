const fs = require('fs');
const path = require('path');

const ffmpeg = require('ffmpeg');

const { processFreeFrame } = require('../util/pyapi');
const { emotionfyVideo } = require('../util/emotionfy');

const { Video, videoAggregations } = require('../models/Video');
const { Simple, Complete } = require('../models/Analysis');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const HttpError = require('../models/HttpError');

exports.postVideo = async (req, res, next) => {
	const user = req.user;

	if (!req.files || !req.files.video) {
		return next(new HttpError('No video sent', 422));
	}

	const videoInput = req.files.video;

	if (videoInput.mimetype !== 'video/mp4' || videoInput.name.indexOf(' ') !== -1) {
		return next(new HttpError('The video format or name is wrong', 422));
	}
	const video = await new Video();

	const uploadsPath = path.join(path.resolve('.'), user, video.id);

	if (!fs.existsSync(uploadsPath)) {
		fs.mkdirSync(uploadsPath, {
			recursive: true
		});
	}
	const filepath = path.join(uploadsPath, `${video.id}_video.mp4`);
	try {
		await req.files.video.mv(filepath);
		const v = await new ffmpeg(filepath);

		video.user = user;
		video.name = videoInput.name;
		video.payment_id = null;
		video.metadata = {
			local_link: filepath,
			bucket_link: '',
			video_size: [v.metadata.video.resolution.w, v.metadata.video.resolution.h],
			frame_rate: v.metadata.video.fps,
			duration: v.metadata.duration.seconds
		};
		video.applied_seconds = 0;
		video.frames = [];
		await video.save();

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
	const user = req.user;
	const videoId = req.params.video_id;
	const seconds = req.body.seconds;

	const video = await Video.findById(videoId);
	video.applied_seconds = seconds;
	if (video.user !== user) {
		return next(new HttpError('The video does not belong to the specified user', 403));
	}
	try {
		await emotionfyVideo(video, processFreeFrame);
		video.payment_id = 'free'
		await video.save();
	} catch (err) {
		return next(new HttpError('Error while analyzing video', 403));
	}

	res.status(200).send({ message: 'Analysis done' });
};

// All of the videos that one user uploaded
exports.getVideos = async (req, res, next) => {
	const user = req.user;

	const pending = await Video
		.where('user')
		.eq(user)
		.where('payment_id')
		.eq(null)
		.where('__v')
		.eq(0)
		.select('metadata.duration');

	const free = await Video
		.where('user')
		.eq(user)
		.where('__v')
		.eq(1)
		.where('payment_id')
		.eq('free')
		.select('name metadata.bucket_link metadata.duration');

	const videos = await Video
		.where('user')
		.eq(user)
		.where('__v')
		.eq(1)
		.where('payment_id')
		.ne('free');

	let payed = await Simple.where('user').eq(user).select('-user');
	if (videos.length > payed.length) {
		payed = [];
		try {
			let sa;
			for (video of videos) {
				sa = await videoAggregations.simple(video._id, user);
				sa = sa._doc;
				delete sa.user;
				payed.push(sa);
			}
		} catch (err) {
			return next(new HttpError('Error on simple analysis of video', 500));
		}
	}

	res.send({ payed, free, pending });
};

// Getting specific video
exports.getVideo = async (req, res, next) => {
	const user = req.user;
	const _id = new ObjectId(req.params.video_id);
	const video = await Video.findOne({ _id, user });

	if (!video) {
		return next(new HttpError('Unable to find that video', 404));
	} else if (video.payment_id === 'free') {
		const analysis = await Video.aggregate()
			.match({
				_id: video._id,
				user
			})
			.unwind({
				path: '$frames',
				includeArrayIndex: 'frame',
				preserveNullAndEmptyArrays: false
			})
			.group({
				_id: '$_id',
				name: {
					$first: '$name'
				},
				link: {
					$first: '$metadata.bucket_link'
				},
				images: {
					$push: '$frames.bucket_link'
				}
			});

		return res.send(analysis[0]);
	} else {
		let analysis = await Complete.findOne({ _id, user }, { user: 0 });
		if (!analysis) {
			try {
				analysis = await videoAggregations.complete(_id, user);
				delete analysis._doc.user;
				return res.send({ ...analysis._doc, link: video.metadata.bucket_link, name: video.name });
			} catch (err) {
				return next(new HttpError('Unable to process video aggregation.', 500));
			}
		} else {
			delete analysis._doc.user;
			return res.send({ ...analysis._doc, link: video.metadata.bucket_link, name: video.name });
		}
	}
};

// Get video processing status
exports.getVideoStatus = async (req, res, next) => {
	const user = req.user;

	const videos = hgetall(user);
	res.send(videos);
};

// Delete video
exports.deleteVideo = async (req, res, next) => {
	const videoId = req.params.video_id;

	try {
		const video = await Video.findById(videoId);
		const result = await video.remove();
		res.send({ message: 'OK' });
	} catch (err) {
		next(new HttpError('No se pudo eliminar el video', 500));
	}
};
