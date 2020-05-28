//TODO Abstract postVideoAnalysis function
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const { bucket } = require('../util/gc');

exports.emotionfyVideo = async (video, callback) => {
	const user = video.user;
	const seconds = video.applied_seconds;
	const uploadsPath = path.resolve(user);
	const v = await new ffmpeg(video.metadata.local_link);
	const files = await v.fnExtractFrameToJPG(uploadsPath, {
		every_n_seconds: seconds,
		file_name: 'video_frame_%s'
	});

	let i = 0;
	for (; i < files.length; i++) {
		bucket.upload(files[i], {
			gzip: true,
			metadata: {
				cacheControl: 'public, max-age=31536000'
			}
		});

		if (i === 0) {
			video.metadata.bucket_link = `https://storage.googleapis.com/${bucket.name}/${video.name}`;
			continue;
		}
		const frame = await callback(files[i]);
		frame.sequence_id = i;
		video.frames.push(frame);

	}
	fs.rmdir(uploadsPath, { recursive: true }, console.log);
	return await video.save();
};
