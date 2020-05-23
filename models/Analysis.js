const mongoose = require('mongoose');

const simpleSchema = mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Video'
	},
	emotion: {
		type: String,
		enum: ['HAPPY', 'SURPRISED', 'ANGRY', 'CONFUSED', 'CALM', 'SAD', 'FEAR', 'DISGUSTED']
	},
	faces: Number,
	user: String,
	duration: Number
});

exports.Simple = mongoose.model('Simple', simpleSchema);
