const mongoose = require('mongoose');

const simpleSchema = mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Video'
	},
	user: String,
	general: {
		name: String,
		emotion: {
			type: String,
			enum: ['HAPPY', 'SURPRISED', 'ANGRY', 'CONFUSED', 'CALM', 'SAD', 'FEAR', 'DISGUSTED']
		},
		gestures: Number,
		link: String,
		duration: Number
	},
	gestures: []

});

const completeSchema = mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Video'
	},
	user: String,
	main: Object,
	counts: Object,
	beards: [Number],
	eyeglasses: [Number],
	females: Number,
	males: Number,
	smiles: [Number],
	sunglasses: [Number],
	ages: Object,
	links: []
});

exports.Simple = mongoose.model('Simple', simpleSchema);
exports.Complete = mongoose.model('Complete', completeSchema);
