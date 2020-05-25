const admin = require('./firebase');
const HttpError = require('../models/HttpError');

exports.authToken = async (req, res, next) => {
	const userToken = req.body.token ? req.body.token : req.params.token;

	try {
		const decodedToken = await admin.auth().verifyIdToken(userToken);
		req.user = decodedToken.uid;
		next();
	} catch (err) {
		return next(new HttpError(err.code, 401));
	}
};
