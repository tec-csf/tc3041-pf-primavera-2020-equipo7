const { bucket } = require('./gc');

const ffmpeg = require('ffmpeg');
const fs = require('fs').promises;
const path = require('path');
const redis = require('redis');
const publisher = redis.createClient();

exports.emotionfyVideo = async (video, callback) => {
	publisher.publish('video', `{"status":"extract", "user":"${video.user}", "id":"${video.id}"}`);
	const user = video.user;
	const seconds = video.applied_seconds;
	const uploadsPath = path.resolve(user, video.id);
	const v = await new ffmpeg(video.metadata.local_link);
	const files = await v.fnExtractFrameToJPG(uploadsPath, {
		every_n_seconds: seconds,
		file_name: `${video.id}_frame_%s`
	});

	publisher.publish('video', `{"status":"process", "user":"${video.user}", "id":"${video.id}"}`);
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

	publisher.publish('video', `{"status":"save", "user":"${video.user}", "id":"${video.id}"}`);
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
