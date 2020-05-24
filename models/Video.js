const mongoose = require('mongoose');
const { frameSchema } = require('./Frame');
const { Simple } = require('../models/Analysis');
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
		return this.Video.aggregate().facet({
			general: [
				{
					'$match': {
						'_id': _id,
						'user': user
					}
				}, {
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
						'emotion': {
							'$max': '$emotions.Type'
						},
						'faces': {
							'$sum': 1
						},
						'user': {
							'$max': '$user'
						},
						'duration': {
							'$max': '$duration'
						}
					}
				}
			],
			faces: [
				{
					'$match': {
						'_id': _id,
						'user': user
					}
				}, {
					'$sort': {
						'frames.analysis.Emotions.Confidence': 1
					}
				}, {
					'$unwind': {
						'path': '$frames',
						'preserveNullAndEmptyArrays': false
					}
				}, {
					'$project': {
						'faces': '$frames.analysis'
					}
				}, {
					'$group': {
						'_id': '$_id',
						'faces': {
							'$push': {
								'$size': '$faces'
							}
						}
					}
				}
			]
		})
	},
	complete: (_id, user) => {
		return this.Video.aggregate([{ $match: { _id, user } }]);
	}
};

videoSchema.pre('save', function (next) {
	if (!this.isNew) {
		for (frame in this.frames) {
			frame.instant = frame.sequence_id * (this.metadata.duration / this.applied_seconds);
		};
	}
	next();
});

videoSchema.post('save', function (doc, next) {
	if (this.frames.length > 0) {
		videoAggregations.simple(this._id, this.user).exec((err, result) => {
			if (err) {
				throw err;
			}
			const faces = result[0].faces[0];
			const general = result[0].general[0];
			new Simple({
				_id: faces._id,
				user: general.user,
				general: {
					emotion: general.emotion,
					faces: general.faces,
					duration: general.duration
				},
				faces: faces.faces,
			}).save((err, product) => {
				if (err) {
					throw err;
				}
				console.log(product);
			});
		});
	}
	next();
});

exports.Video = mongoose.model('Video', videoSchema);
