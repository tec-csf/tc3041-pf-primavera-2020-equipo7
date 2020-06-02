import React from 'react';
import { Button } from 'reactstrap';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = (props) => {

	const handleClick = async (event) => {
		// Call your backend to create the Checkout session.
		props.setLoading(true);
		// When the customer clicks on the button, redirect them to Checkout.
		const stripe = await stripePromise;
		const { error } = await stripe.redirectToCheckout({
			mode: 'payment',
			lineItems: [ { price: process.env.REACT_APP_PRICE_ID, quantity: props.images } ],
			clientReferenceId: props.video,
			successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${window.location.origin}/canceled`
		});
		// If `redirectToCheckout` fails due to a browser or network
		// error, display the localized error message to your customer
		// using `error.message`.
		if (error) {
			//dispatch({ type: 'setError', payload: { error } });
			props.setLoading(false);
		}
	};

	return (
		<React.Fragment>
			<Button block outline color="success" onClick={handleClick} disabled={props.isLoading}>
				{props.isLoading ? 'Loading...' : `Pay ${props.price} USD`}
			</Button>
			{/* <div className="sr-field-error">{state.error ? error.message : ''}</div> */}
		</React.Fragment>
	);
};

Checkout.propTypes = {
	price: PropTypes.string.isRequired,
	images: PropTypes.number.isRequired,
	//id video
	video: PropTypes.string.isRequired,

	isLoading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
};

export default Checkout;
