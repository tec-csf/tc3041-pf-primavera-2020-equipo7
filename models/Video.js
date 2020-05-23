const mongoose = require('mongoose');
const { frameSchema } = require('./Frame');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
	user: String,
	name: String,
	metadata: {
		local_link: String,
		bucket_link: String,
		video_size: [Number, Number],
		frame_rate: Number,
		duration: Number
	},
	applied_seconds: Number,
	frames: [frameSchema]
});

const videoAggregations = {
	simple: (_id, user) => {
		return this.Video.aggregate([
			{
				$match: { _id, user }
			},
			{
				'$sort': {
					'frames.analysis.Emotions.Confidence': 1
				}
			}, {
				'$unwind': {
					'path': '$frames',
					'preserveNullAndEmptyArrays': false
				}
			}, {
				'$unwind': {
					'path': '$frames.analysis',
					'preserveNullAndEmptyArrays': false
				}
			}, {
				'$project': {
					'duration': '$metadata.duration',
					'user': '$user',
					'emotions': {
						'$arrayElemAt': [
							'$frames.analysis.Emotions', 0
						]
					}
				}
			}, {
				'$group': {
					'_id': '$_id',
					'emotions': {
						'$max': '$emotions.Type'
					},
					'faces': {
						'$sum': 1
					},
					'duration': {
						'$max': '$duration'
					}
				}
			}, {
				'$merge': {
					'into': 'simple',
					'on': '_id',
					'whenMatched': 'replace',
					'whenNotMatched': 'insert'
				}
			}
		]);
	},
	complete: (_id, user) => {
		return this.Video.aggregate([{ $match: { _id, user } }]);
	}
};

videoSchema.pre('save', function (next) {
	
	if (!this.isNew) {
		videoAggregations.simple(this._id, this.user);
	
		for (frame in this.frames) {
			frame.instant = frame.sequence_id * (this.metadata.duration / this.applied_seconds);
		};
	}
	next();
});

exports.Video = mongoose.model('Video', videoSchema);
