const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const frameSchema = new Schema({
	name: String,
	path: String,
	user: String,
	payment_id: String,
	local_link: String,
	instant: Number,
	sequence_id: Number,
	bucket_link: String,
	analysis: [
		{
			AgeRange: {
				High: Number,
				Low: Number
			},
			Beard: {
				Confidence: Number,
				Value: Boolean
			},
			BoundingBox: {
				Height: Number,
				Left: Number,
				Top: Number,
				Width: Number
			},
			Confidence: Number,
			Emotions: [
				{
					Confidence: Number,
					Type: {
						type: String,
						enum: [ 'HAPPY', 'SURPRISED', 'ANGRY', 'CONFUSED', 'CALM', 'SAD', 'FEAR', 'DISGUSTED' ]
					}
				}
			],
			Eyeglasses: {
				Confidence: Number,
				Value: Boolean
			},
			EyesOpen: {
				Confidence: Number,
				Value: Boolean
			},
			Gender: {
				Confidence: Number,
				Value: String
			},
			Landmarks: [
				{
					Type: {
						type: String,
						enum: [
							'eyeLeft',
							'eyeRight',
							'mouthLeft',
							'mouthRight',
							'nose',
							'leftEyeBrowLeft',
							'leftEyeBrowRight',
							'leftEyeBrowUp',
							'rightEyeBrowLeft',
							'rightEyeBrowRight',
							'rightEyeBrowUp',
							'leftEyeLeft',
							'leftEyeRight',
							'leftEyeUp',
							'leftEyeDown',
							'rightEyeLeft',
							'rightEyeRight',
							'rightEyeUp',
							'rightEyeDown',
							'noseLeft',
							'noseRight',
							'mouthUp',
							'mouthDown',
							'leftPupil',
							'rightPupil',
							'upperJawlineLeft',
							'midJawlineLeft',
							'chinBottom',
							'midJawlineRight',
							'upperJawlineRight'
						]
					},
					X: Number,
					Y: Number
				}
			],
			MouthOpen: {
				Confidence: Number,
				Value: Boolean
			},
			Mustache: {
				Confidence: Number,
				Value: Boolean
			},
			Pose: {
				Pitch: Number,
				Roll: Number,
				Yaw: Number
			},
			Quality: {
				Brightness: Number,
				Sharpness: Number
			},
			Smile: {
				Confidence: Number,
				Value: Boolean
			},
			Sunglasses: {
				Confidence: Number,
				Value: Boolean
			}
		}
	]
});
exports.frameSchema = frameSchema;

exports.Frame = mongoose.model('Frame', frameSchema);
