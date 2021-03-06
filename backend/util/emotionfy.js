const ffmpeg = require('ffmpeg');
const fs = require('fs').promises;
const path = require('path');

const { bucket } = require('./gc');
const { publish, status } = require('./realtime');

exports.emotionfyVideo = async (video, callback) => {
	const user = video.user;
	const seconds = video.applied_seconds;
	const uploadsPath = path.resolve(user, video.id);

	publish(video.user, video.id, status.EXTRACT);

	const v = await new ffmpeg(video.metadata.local_link);
	const files = await v.fnExtractFrameToJPG(uploadsPath, {
		every_n_seconds: seconds,
		file_name: `${video.id}_frame_%s`
	});

	publish(video.user, video.id, status.PROCESS);

	let i = 0;
	for (; i < files.length; i++) {
		if (files[i] === video.metadata.local_link) {
			video.metadata.bucket_link = `https://storage.googleapis.com/${bucket.name}/${video.id}_video.mp4`;
			continue;
		}
		const frame = await callback(files[i]);
		if (frame) {
			frame.sequence_id = i;
			video.frames.push(frame);
		}

	}

	publish(video.user, video.id, status.SAVE);

	for (let i = 0; i < files.length; i++) {
		if (i === files.length - 1) {
			bucket.upload(files[i], {
				gzip: true,
				metadata: {
					cacheControl: 'public, max-age=31536000'
				}
			}).then(async () => {
				await fs.rmdir(uploadsPath, { recursive: true });
			});
		} else {
			bucket.upload(files[i], {
				gzip: true,
				metadata: {
					cacheControl: 'public, max-age=31536000'
				}
			}).catch(console.log);
		}
	}
		
	const result = await video.save();
	
	return result;
};
