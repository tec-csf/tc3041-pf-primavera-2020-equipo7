const mongoose = require('mongoose');

const simpleSchema = mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Video'
	},
	user: String,
	general: {
		emotion: {
			type: String,
			enum: ['HAPPY', 'SURPRISED', 'ANGRY', 'CONFUSED', 'CALM', 'SAD', 'FEAR', 'DISGUSTED']
		},
		faces: Number,
		duration: Number
	},
	faces: []

});

const completeSchema = mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Video'
	},
	user: String,
	beard: Number,
	eyeglasses: Number,
	females: Number,
	males: Number,
	smiles: Number,
	sunglasses: Number
});

exports.Simple = mongoose.model('Simple', simpleSchema);
exports.Complete = mongoose.model('Complete', completeSchema);
