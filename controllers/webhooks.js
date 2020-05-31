const mongoose = require('mongoose');
const { STRIPE_SECRET_KEY, CHARGE_PER_FRAME } = require('../config/secrets');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const { Video } = require('../models/Video');
const { emotionfyVideo } = require('../util/emotionfy');
const { processFrame } = require('../util/aws');

const PaymentIntentStatus = {
	CREATED: 'payment_intent.created',
	SUCCEEDED: 'payment_intent.succeeded',
	CANCELED: 'payment_intent.canceled',
	FAILED: 'payment_intent.payment_failed'
}


exports.postCheckoutSession = async (req, res) => {
	const { data } = req.body;
	const video = await Video.findById(data.object.client_reference_id);
	
	const paymentIntent = await stripe.paymentIntents.retrieve(data.object.payment_intent);

	let status = paymentIntent.status;
	if (video && status === 'succeeded') {//TODO Check payment_intent status
		video.applied_seconds = Math.round(video.metadata.duration / Math.round((paymentIntent.amount / 100) / CHARGE_PER_FRAME));
		video.payment_id = data.object.payment_intent;
		video.save();
		try {
			await emotionfyVideo(video, processFrame);
		} catch(err) {
			video.remove();
			console.log(err);
		}
	}
	res.send({ message: 'received' });
};
