const { STRIPE_SECRET_KEY, CHARGE_PER_FRAME } = require('../config/secrets');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const { emotionfyVideo } = require('../util/emotionfy');
const { processFrame } = require('../util/aws');
const { publish, status } = require('../util/realtime');

const { Video } = require('../models/Video');


exports.postCheckoutSession = async (req, res) => {
	const { data } = req.body;
	const video = await Video.findById(data.object.client_reference_id);
	
	const paymentIntent = await stripe.paymentIntents.retrieve(data.object.payment_intent);
	const status = paymentIntent.status;

	
	if (video && status === 'succeeded') {
		video.applied_seconds = Math.round(video.metadata.duration / Math.round((paymentIntent.amount / 100) / CHARGE_PER_FRAME));
		video.payment_id = data.object.payment_intent;
		video.save();
		try {
			await emotionfyVideo(video, processFrame);
			publish(video.user, video.id, status.COMPLETE);
		} catch(err) {
			video.remove();
			console.log(err);
		}
	}
	res.send({ message: 'received' });
};
