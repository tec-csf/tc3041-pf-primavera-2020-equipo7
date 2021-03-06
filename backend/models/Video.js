const fs = require('fs').promises;
const path = require('path');

const mongoose = require('mongoose');

const { bucket } = require('../util/gc');

const { frameSchema } = require('./Frame');
const { Simple, Complete } = require('../models/Analysis');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
	user: String,
	name: String,
	payment_id: String,
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
	simple: async (_id, user) => {
		const analysis = await Simple.findOne({ _id, user });
		if (analysis) {
			return analysis;
		} else {
			const result = await this.Video.aggregate().facet({
				general: [
					{
						$match: {
							user,
							_id
						}
					}, {
						$project: {
							metadata: '$metadata',
							user: '$user',
							name: '$name',
							emotions: '$frames.analysis.Emotions'
						}
					}, {
						$unwind: {
							path: '$emotions',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$emotions',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$emotions',
							includeArrayIndex: 'emotion',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$sort: {
							'emotions.Confidence': -1
						}
					}, {
						$group: {
							_id: {
								face: '$face',
								frame: '$frame'
							},
							video_id: {
								$first: '$_id'
							},
							name: {
								$first: '$name'
							},
							metadata: {
								$first: '$metadata'
							},
							emotion: {
								$push: '$emotions'
							}
						}
					}, {
						$project: {
							user: 1,
							name: 1,
							video_id: 1,
							duration: '$metadata.duration',
							link: '$metadata.bucket_link',
							emotion: {
								$arrayElemAt: [
									'$emotion', 0
								]
							}
						}
					}, {
						$group: {
							_id: '$emotion.Type',
							name: {
								$first: '$name'
							},
							video_id: {
								$first: '$video_id'
							},
							emotion: {
								$sum: 1
							},
							link: {
								$first: '$link'
							},
							duration: {
								$first: '$duration'
							}
						}
					}, {
						$sort: {
							emotion: -1
						}
					}, {
						$group: {
							_id: '$video_id',
							name: {
								$first: '$name'
							},
							emotion: {
								$first: '$_id'
							},
							gestures: {
								$sum: '$emotion'
							},
							link: {
								$first: '$link'
							},
							duration: {
								$first: '$duration'
							}
						}
					}
				],
				gestures: [
					{
						$match: {
							_id,
							user
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
							user: '$user',
							faces: '$frames.analysis'
						}
					}, {
						$group: {
							_id: '$_id',
							user: {
								$first: '$user'
							},
							gestures: {
								$push: {
									$size: '$faces'
								}
							}
						}
					}
				]
			});

			const faces = result[0].gestures[0];
			const general = result[0].general[0];
			// delete general._id;
			return await new Simple({
				_id: faces._id,
				user: faces.user,
				general,
				gestures: faces.gestures,
			}).save();
		}
	},
	complete: async (_id, user) => {
		const analysis = await Complete.findOne({ _id, user });
		if (analysis) {
			return analysis;
		} else {
			const result = await this.Video.aggregate().facet({
				main: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$unwind: {
							path: '$frames',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$project: {
							faces: '$frames.analysis.Emotions',
							i: '$frames.sequence_id'
						}
					}, {
						$unwind: {
							path: '$faces',
							includeArrayIndex: 'face'
						}
					}, {
						$unwind: {
							path: '$faces',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$sort: {
							'faces.Confidence': -1
						}
					}, {
						$group: {
							_id: {
								i: '$i',
								face: '$face'
							},
							emotions: {
								$push: '$faces'
							}
						}
					}, {
						$project: {
							i: '$_id.i',
							face: '$_id.face',
							emotion: {
								$arrayElemAt: [
									'$emotions', 0
								]
							}
						}
					}, {
						$group: {
							_id: '$i',
							happy: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'HAPPY'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							surprised: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'SURPRISED'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							angry: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'ANGRY'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							confused: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'CONFUSED'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							calm: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'CALM'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							sad: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'SAD'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							fear: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'FEAR'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							disgusted: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'DISGUSTED'
											]
										},
										then: 0,
										else: 1
									}
								}
							}
						}
					}, {
						$sort: {
							_id: 1
						}
					}
				],
				counts: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$unwind: {
							path: '$frames',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$project: {
							faces: '$frames.analysis.Emotions',
							i: '$frames.sequence_id'
						}
					}, {
						$unwind: {
							path: '$faces',
							includeArrayIndex: 'face'
						}
					}, {
						$unwind: {
							path: '$faces',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$sort: {
							'faces.Confidence': -1
						}
					}, {
						$group: {
							_id: {
								i: '$i',
								face: '$face'
							},
							emotions: {
								$push: '$faces'
							}
						}
					}, {
						$project: {
							i: '$_id.i',
							face: '$_id.face',
							emotion: {
								$arrayElemAt: [
									'$emotions', 0
								]
							}
						}
					}, {
						$group: {
							_id: '$i',
							happy: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'HAPPY'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							surprised: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'SURPRISED'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							angry: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'ANGRY'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							confused: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'CONFUSED'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							calm: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'CALM'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							sad: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'SAD'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							fear: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'FEAR'
											]
										},
										then: 0,
										else: 1
									}
								}
							},
							disgusted: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$emotion.Type', 'DISGUSTED'
											]
										},
										then: 0,
										else: 1
									}
								}
							}
						}
					}, {
						$sort: {
							_id: 1
						}
					}, {
						$group: {
							_id: null,
							happy: {
								$sum: '$happy'
							},
							surprised: {
								$sum: '$surprised'
							},
							angry: {
								$sum: '$angry'
							},
							confused: {
								$sum: '$confused'
							},
							calm: {
								$sum: '$calm'
							},
							sad: {
								$sum: '$sad'
							},
							fear: {
								$sum: '$fear'
							},
							disgusted: {
								$sum: '$disgusted'
							}
						}
					}
				],
				sunglasses: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$sort: {
							'frames.analysis.Emotions.Confidence': 1
						}
					}, {
						$unwind: {
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$frames.analysis',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: '$frame',
							sunglasses: {
								$sum: {
									$cond: {
										if: '$frames.analysis.Sunglasses.Value',
										then: 1,
										else: 0
									}
								}
							}
						}
					}, {
						$sort: {
							_id: 1
						}
					}, {
						$group: {
							_id: null,
							sunglasses: {
								$push: '$sunglasses'
							}
						}
					}, {
						$project: {
							_id: 0,
							sunglasses: 1
						}
					}
				],
				eyeglasses: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$sort: {
							'frames.analysis.Emotions.Confidence': 1
						}
					}, {
						$unwind: {
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$frames.analysis',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: '$frame',
							eyeglasses: {
								$sum: {
									$cond: {
										if: '$frames.analysis.Eyeglasses.Value',
										then: 1,
										else: 0
									}
								}
							}
						}
					}, {
						$sort: {
							_id: 1
						}
					}, {
						$group: {
							_id: null,
							eyeglasses: {
								$push: '$eyeglasses'
							}
						}
					}, {
						$project: {
							_id: 0,
							eyeglasses: 1
						}
					}
				],
				smiles: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$sort: {
							'frames.analysis.Emotions.Confidence': 1
						}
					}, {
						$unwind: {
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$frames.analysis',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: '$frame',
							smiles: {
								$sum: {
									$cond: {
										if: '$frames.analysis.Smile.Value',
										then: 1,
										else: 0
									}
								}
							}
						}
					}, {
						$sort: {
							_id: 1
						}
					}, {
						$group: {
							_id: null,
							smiles: {
								$push: '$smiles'
							}
						}
					}, {
						$project: {
							_id: 0,
							smiles: 1
						}
					}
				],
				beards: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$sort: {
							'frames.analysis.Emotions.Confidence': 1
						}
					}, {
						$unwind: {
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$frames.analysis',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: '$frame',
							beards: {
								$sum: {
									$cond: {
										if: '$frames.analysis.Beard.Value',
										then: 1,
										else: 0
									}
								}
							}
						}
					}, {
						$sort: {
							_id: 1
						}
					}, {
						$group: {
							_id: null,
							beards: {
								$push: '$beards'
							}
						}
					}, {
						$project: {
							_id: 0,
							beards: 1
						}
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
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$frames.analysis',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: null,
							males: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$frames.analysis.Gender.Value', 'Male'
											]
										},
										then: 1,
										else: 0
									}
								}
							},
							total: {
								$sum: 1
							}
						}
					}, {
						$project: {
							_id: 0,
							males: {
								$divide: [
									'$males', '$total'
								]
							}
						}
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
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$unwind: {
							path: '$frames.analysis',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: null,
							females: {
								$sum: {
									$cond: {
										if: {
											$strcasecmp: [
												'$frames.analysis.Gender.Value', 'Female'
											]
										},
										then: 1,
										else: 0
									}
								}
							},
							total: {
								$sum: 1
							}
						}
					}, {
						$project: {
							_id: 0,
							females: {
								$divide: [
									'$females', '$total'
								]
							}
						}
					}
				],
				links: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$unwind: {
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: '$_id',
							links: {
								$push: '$frames.bucket_link'
							}
						}
					}, {
						$project: {
							_id: 0,
							links: 1
						}
					}
				],
				ages: [
					{
						$match: {
							_id,
							user
						}
					}, {
						$unwind: {
							path: '$frames',
							includeArrayIndex: 'frame',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$project: {
							_id: 0,
							frame: 1,
							age_range: '$frames.analysis.AgeRange'
						}
					}, {
						$unwind: {
							path: '$age_range',
							includeArrayIndex: 'face',
							preserveNullAndEmptyArrays: false
						}
					}, {
						$group: {
							_id: null,
							min_age: {
								$min: '$age_range.Low'
							},
							max_age: {
								$max: '$age_range.High'
							}
						}
					}, {
						$project: {
							_id: 0,
							min_age: 1,
							max_age: 1
						}
					}
				]
			});

			const doc = {};
			doc._id = _id;
			doc.user = user;
			doc.main = Object.keys(result[0].main).length ? result[0].main : [];
			doc.counts = result[0].counts.length ? result[0].counts[0] : {};
			doc.beards = result[0].beards.length ? result[0].beards[0].beards : [];
			doc.eyeglasses = result[0].eyeglasses.length ? result[0].eyeglasses[0].eyeglasses : [];
			doc.females = result[0].females.length ? result[0].females[0].females : 0;
			doc.males = result[0].males.length ? result[0].males[0].males : 0;
			doc.smiles = result[0].smiles.length ? result[0].smiles[0].smiles : [];
			doc.sunglasses = result[0].sunglasses.length ? result[0].sunglasses[0].sunglasses : [];
			doc.links = result[0].links.length ? result[0].links[0].links : [];
			doc.ages = result[0].ages.length ? result[0].ages[0] : {};

			return await new Complete(doc).save();
		}

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

videoSchema.post('save', async function (doc, next) {
	if (this.__v && this.payment_id !== 'free' && this.payment_id !== null) {
		try {
			await videoAggregations.simple(this._id, this.user);
			await videoAggregations.complete(this._id, this.user);
		} catch (err) {
			throw err;
		}
	}
	next();
});

videoSchema.pre('remove', async function (next) {
	try {
		if (this.__v) {
			await Simple.deleteOne({ _id: this._id });
			await Complete.deleteOne({ _id: this._id });
			for (let frame of this.frames) {
				const frameLinkArray = frame.bucket_link.split('/');
				await bucket.file(frameLinkArray[frameLinkArray.length - 1]).delete();
			}
			await bucket.file(`${this.id}_video.mp4`).delete();
		} else {
			await fs.rmdir(path.resolve(this.user), {
				recursive: true
			});
		}
	} catch(err) {
		console.error(err);
	} finally {
		next();
	}

});

exports.Video = mongoose.model('Video', videoSchema);
exports.videoAggregations = videoAggregations;
