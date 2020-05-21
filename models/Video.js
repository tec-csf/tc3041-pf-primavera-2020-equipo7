const mongoose = require('mongoose');
const { frameSchema } = require('./Frame');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
	metadata: {
		bucket_link: String,
		video_size: [Number, Number],
		frame_rate: Number,
		duration: Number
	},
	applied_fr: Number,
	frames: [frameSchema]
});

videoSchema.pre('save', (next) => {
	if (this.isNew) {
		for (frame in this.frames) {
			frame.instant = (1/this.applied_fr) * frame.sequence_id
		};
	}
	next();
});

module.exports = mongoose.model('Video', videoSchema);
