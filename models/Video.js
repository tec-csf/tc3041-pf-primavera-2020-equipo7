const mongoose = require('mongoose');
const { frameSchema } = require('./Frame');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
	metadata: {
		bucket_link: String,
		file_size: Number,
		video_size: [Number, Number],
		frame_rate: Number, //intrinsecal fr
		duration: Number
	},
	applied_fr: Number, //fr when applying video division
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
