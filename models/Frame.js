const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const frameSchema = new Schema({
	path: String,
	instant: Number,
	sequence_id: Number,
	metadata: {
		bucket_link: String,
		filesize: Number,
		imageSize: [Number, Number]
	},
	analysis: {
			age_range: {
				high: Number,
				low: Number
			},
			bounding_box: {
				height: Number,
				left: Number,
				top: Number,
				width: Number
			},
			confidence: Number,
			emotions: [
				{
					confidence: Number,
					type: 'DISGUSTED'
				},
				{
					confidence: Number,
					type: 'HAPPY'
				},
				{
					confidence: Number,
					type: 'SURPRISED'
				},
				{
					confidence: Number,
					type: 'ANGRY'
				},
				{
					confidence: Number,
					type: 'CONFUSED'
				},
				{
					confidence: Number,
					type: 'CALM'
				},
				{
					confidence: Number,
					type: 'SAD'
				}
			],
			gender: {
				confidence: Number,
				value: Male
			},
		}
	});
exports.frameSchema = frameSchema;

module.exports = mongoose.model('Frame', frameSchema);