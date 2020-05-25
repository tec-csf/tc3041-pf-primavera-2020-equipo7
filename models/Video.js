const mongoose = require('mongoose');
const { frameSchema } = require('./Frame');
const { Simple, Complete } = require('../models/Analysis');
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
					$match: {
						_id,
						user: user
					}
				}, {
					$sort: {
						'frames.analysis.Emotions.Confidence': 1
					}
				}, {
					$unwind: {
						path: '$frames',
						preserveNullAndEmptyArrays: false
					}
				}, {
					$unwind: {
						path: '$frames.analysis',
						preserveNullAndEmptyArrays: false
					}
				}, {
					$project: {
						duration: '$metadata.duration',
						user: '$user',
						emotions: {
							$arrayElemAt: [
								'$frames.analysis.Emotions', 0
							]
						}
					}
				}, {
					$group: {
						_id: '$_id',
						emotion: {
							$max: '$emotions.Type'
						},
						faces: {
							$sum: 1
						},
						user: {
							$max: '$user'
						},
						duration: {
							$max: '$duration'
						}
					}
				}
			],
			faces: [
				{
					$match: {
						_id,
						user: user
					}
				}, {
					$sort: {
						'frames.analysis.Emotions.Confidence': 1
					}
				}, {
					$unwind: {
						path: '$frames',
						preserveNullAndEmptyArrays: false
					}
				}, {
					$project: {
						faces: '$frames.analysis'
					}
				}, {
					$group: {
						_id: '$_id',
						faces: {
							$push: {
								$size: '$faces'
							}
						}
					}
				}
			]
		});
	},
	complete: (_id, user) => {
		return this.Video.aggregate().facet({
			sunglasses: [
				{
					$match: {
						_id,
						user
					}
				}, {
					$unwind: {
						path: '$frames'
					}
				}, {
					$match: {
						'frames.analysis.Sunglasses.Value': true
					}
				}, {
					$count: 'Sunglasses'
				}
			],
			eyeglasses: [
				{
					$match: {
						_id,
						user
					}
				}, {
					$unwind: {
						path: '$frames'
					}
				}, {
					$match: {
						'frames.analysis.Eyeglasses.Value': true
					}
				}, {
					$count: 'Eyeglasses'
				}
			],
			smiles: [
				{
					$match: {
						_id,
						user
					}
				}, {
					$unwind: {
						path: '$frames'
					}
				}, {
					$match: {
						'frames.analysis.Smile.Value': true
					}
				}, {
					$count: 'Smiles'
				}
			],
			beard: [
				{
					$match: {
						_id,
						user
					}
				}, {
					$unwind: {
						path: '$frames'
					}
				}, {
					$match: {
						'frames.analysis.Beard.Value': true
					}
				}, {
					$count: 'Beard'
				}
			],
			males: [
				{
					$match: {
						_id,
						user
					}
				}, {
					$unwind: {
						path: '$frames'
					}
				}, {
					$match: {
						'frames.analysis.Gender.Value': 'Male'
					}
				}, {
					$count: 'Males'
				}
			],
			females: [
				{
					$match: {
						_id,
						user
					}
				}, {
					$unwind: {
						path: '$frames'
					}
				}, {
					$match: {
						'frames.analysis.Gender.Value': 'Female'
					}
				}, {
					$count: 'Females'
				}
			]
		});
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
			}).save((err) => {
				if (err) {
					throw err;
				}
			});
		});
		videoAggregations.complete(this._id, this.user).exec((err, result) => {
			if (err) {
				throw err;
			}
			const doc = {};
			doc._id = this._id;
			doc.user = this.user;
			doc.beard = result[0].beard.length ? result[0].beard[0].Beard : 0;
			doc.eyeglasses = result[0].eyeglasses.length ? result[0].eyeglasses[0].Eyeglasses : 0;
			doc.females = result[0].females.length ? result[0].females[0].Females : 0;
			doc.males = result[0].males.length ? result[0].males[0].Males : 0;
			doc.smiles = result[0].smiles.length ? result[0].smiles[0].Smiles : 0;
			doc.sunglasses = result[0].sunglasses.length ? result[0].sunglasses[0].Sunglasses : 0;

			new Complete(doc).save((err) => {
				if (err) {
					throw err;
				}
			})
		});
	}
	next();
});

exports.Video = mongoose.model('Video', videoSchema);
