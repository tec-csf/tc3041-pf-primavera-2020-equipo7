const mongoose = require('mongoose');

const { Video } = require('../models/Video');
const { emotionfyVideo } = require('../util/emotionfy');
const { processFrame } = require('../util/aws');

const PaymentIntentStatus = {
	SUCCEEDED: 'payment_intent.succeeded',
	CANCELED: 'payment_intent.canceled',
	FAILED: 'payment_intent.payment_failed'
}


exports.postCheckoutSession = async (req, res) => {
	const { type, data } = req.body;//TODO Get number of frames
	const video = await Video.updateOne(
		{
			_id: mongoose.Types.ObjectId(data.client_reference_id)
		},{
			payment_id: data.payment_id
		});

	res.send({ message: 'received' });
};

exports.postPayment = async (req, res) => {
	const { type, data } = req.body;

	switch(type) {
		case PaymentIntentStatus.SUCCEEDED:
			const video = await Video.find({ payment_id: data.object.id });
			await emotionfyVideo(video, processFrame);
			break;
		case PaymentIntentStatus.CANCELED:
		case PaymentIntentStatus.FAILED:
			Video.deleteOne({ payment_id: data.object.id});//TODO Let Rob know of deletion
			break;
		default:
	}

	res.send({ message: 'received' });
};
