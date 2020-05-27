const { Video } = require('../models/Video');

const PaymentIntentStatus = {
	SUCCEEDED: 'payment_intent.succeeded',
	CANCELED: 'payment_intent.canceled',
	FAILED: 'payment_intent.payment_failed'
}


exports.postCheckoutSession = async (req, res) => {
	const { type, data } = req.body;
	const video = await Video.updateOne(
		{
			_id: data.client_reference_id
		},{
			payment_id: data.payment_id
		});

	res.send({ message: 'received' });
};

exports.postPayment = (req, res) => {
	const { type, data } = req.body;

	switch(type) {
		case PaymentIntentStatus.SUCCEEDED://TODO Get abstracted function and process video
		case PaymentIntentStatus.CANCELED:
		case PaymentIntentStatus.FAILED:
			Video.deleteOne({ payment_id: data.object.id});//TODO Let Rob know of deletion
		default:
	}

	res.send({ message: 'received' });
};
