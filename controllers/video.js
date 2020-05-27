const fs = require('fs');
const path = require('path');

const ffmpeg = require('ffmpeg');

const { bucket } = require('../util/gc');
const { processFrame } = require('../util/aws');
const { emotionfyVideo } = require('../util/emotionfy');

const { Video, videoAggregations } = require('../models/Video');
const { Simple, Complete } = require('../models/Analysis');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const HttpError = require('../models/HttpError');

exports.postVideo = async (req, res, next) => {
	const videoInput = req.files.video;
	const user = req.user;

	if (!req.files || videoInput.mimetype !== 'video/mp4' || videoInput.name.indexOf(' ') !== -1) {
		return next(new HttpError('The video format or name is wrong.', 422));
	}
	const uploadsPath = path.join(path.resolve('.'), user);
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
	const user = req.user;
	const videoId = req.params.video_id;
	const seconds = req.body.seconds;

	const video = await Video.findById(videoId);
	video.applied_seconds = seconds;
	if (video.user !== user) {
		return next(new HttpError('The video does not belong to the specified user', 403));
	}
	try {
		await emotionfyVideo(video, processFrame);
	} catch(err) {
		return next(new HttpError('Error while analyzing video', 403));
	}

	res.status(200).send({ message: 'Analysis done' });
};

// All of the videos that one user uploaded
exports.getVideos = async (req, res, next) => {
	const user = req.user;
	//TODO Check each video to see if it is free
	const videos = await Video.find({ user });
	let simpleAnalysis = await Simple.find({ user });
	if (videos.length > simpleAnalysis.length) {
		simpleAnalysis = [];
		try {
			for (video of videos) {
				simpleAnalysis.push(await videoAggregations.simple(video._id, user));
			}
		} catch (err) {
			return next(new HttpError('Error on simple analysis of video', 500));
		}
	}
	res.send(simpleAnalysis);
};

// Getting specific video
exports.getVideo = async (req, res, next) => {
	const user = req.user;
	const _id = new ObjectId(req.params.video_id);
	//TODO Check if video is free and if it is don't send Complete
	const video = await Video.findOne({ _id, user });
	let analysis = await Complete.findOne({ _id, user }, { user: 0 });
	if (!video) {
		next(new HttpError('Unable to find that video', 404));
	} else if (!analysis) {
		try {
			analysis = await videoAggregations.complete(_id, user);
			res.send({ ...analysis._doc, link: video.metadata.bucket_link });
		} catch (err) {
			next(new HttpError('Unable to process video aggregation.', 500));
		}
	} else {
		res.send({ ...analysis._doc, link: video.metadata.bucket_link });
	}
};
