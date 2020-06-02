const admin = require('./firebase');
const HttpError = require('../models/HttpError');

exports.authToken = async (req, res, next) => {
	let token = req.headers.authorization;
	try {
		token = token.replace(/Bearer\s/, '');
	} catch (err) {
		return next(new HttpError('Error while processing user token', 500));
	}

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		req.user = decodedToken.uid;
		next();
	} catch (err) {
		return next(new HttpError(err.code, 401));
	}
};
