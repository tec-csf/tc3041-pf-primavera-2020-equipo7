const HttpError = require('../models/http-error');
const userSchema = require('../models/videos');
const mongoose = require('mongoose');
const devise = require('mongoose-devise');
const ObjectId = mongoose.Types.ObjectId;
const videoCollection = mongoose.model('video', userSchema, 'videos');

// Create new user
exports.video_create = function (req, res, next) {
    console.log('Deleting a video');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new videoCollection({
	// 	nombre,
	// 	tipo,
	// 	index,
	// 	...field,
	// 	id_plantilla: ObjectId(req.params.id)
	// })
	// 	.save()
	// 	.then(
	// 		(/*ans*/) => {
	// 			//console.log('Complete', ans);
	// 			return res.status(201).json({ message: 'complete' });
	// 		}
	// 	)
	// 	.catch((err) => {
	// 		console.log('Error creating format:', err);
	// 		return next(new HttpError(err.errmsg, 422));
	// 	});
};

// Delete user
exports.video_delete = function (req, res, next) {
    console.log('Deleting a video');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new videoCollection({
	// 	nombre,
	// 	tipo,
	// 	index,
	// 	...field,
	// 	id_plantilla: ObjectId(req.params.id)
	// })
	// 	.save()
	// 	.then(
	// 		(/*ans*/) => {
	// 			//console.log('Complete', ans);
	// 			return res.status(201).json({ message: 'complete' });
	// 		}
	// 	)
	// 	.catch((err) => {
	// 		console.log('Error creating format:', err);
	// 		return next(new HttpError(err.errmsg, 422));
	// 	});
};

// Update user
exports.video_update = function (req, res, next) {
    console.log('Deleting a video');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new videoCollection({
	// 	nombre,
	// 	tipo,
	// 	index,
	// 	...field,
	// 	id_plantilla: ObjectId(req.params.id)
	// })
	// 	.save()
	// 	.then(
	// 		(/*ans*/) => {
	// 			//console.log('Complete', ans);
	// 			return res.status(201).json({ message: 'complete' });
	// 		}
	// 	)
	// 	.catch((err) => {
	// 		console.log('Error creating format:', err);
	// 		return next(new HttpError(err.errmsg, 422));
	// 	});
};

// user details
exports.video_detail = function (req, res, next) {
    console.log('Deleting a video');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new videoCollection({
	// 	nombre,
	// 	tipo,
	// 	index,
	// 	...field,
	// 	id_plantilla: ObjectId(req.params.id)
	// })
	// 	.save()
	// 	.then(
	// 		(/*ans*/) => {
	// 			//console.log('Complete', ans);
	// 			return res.status(201).json({ message: 'complete' });
	// 		}
	// 	)
	// 	.catch((err) => {
	// 		console.log('Error creating format:', err);
	// 		return next(new HttpError(err.errmsg, 422));
	// 	});
};

// user list
exports.video_list = function (req, res, next) {
    console.log('Deleting a video');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new videoCollection({
	// 	nombre,
	// 	tipo,
	// 	index,
	// 	...field,
	// 	id_plantilla: ObjectId(req.params.id)
	// })
	// 	.save()
	// 	.then(
	// 		(/*ans*/) => {
	// 			//console.log('Complete', ans);
	// 			return res.status(201).json({ message: 'complete' });
	// 		}
	// 	)
	// 	.catch((err) => {
	// 		console.log('Error creating format:', err);
	// 		return next(new HttpError(err.errmsg, 422));
	// 	});
};

// user list
exports.video_search = function (req, res, next) {
    console.log('Deleting a video');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new videoCollection({
	// 	nombre,
	// 	tipo,
	// 	index,
	// 	...field,
	// 	id_plantilla: ObjectId(req.params.id)
	// })
	// 	.save()
	// 	.then(
	// 		(/*ans*/) => {
	// 			//console.log('Complete', ans);
	// 			return res.status(201).json({ message: 'complete' });
	// 		}
	// 	)
	// 	.catch((err) => {
	// 		console.log('Error creating format:', err);
	// 		return next(new HttpError(err.errmsg, 422));
	// 	});
};

// user list
exports.video_total = function (req, res, next) {
    console.log('Deleting a video');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new videoCollection({
	// 	nombre,
	// 	tipo,
	// 	index,
	// 	...field,
	// 	id_plantilla: ObjectId(req.params.id)
	// })
	// 	.save()
	// 	.then(
	// 		(/*ans*/) => {
	// 			//console.log('Complete', ans);
	// 			return res.status(201).json({ message: 'complete' });
	// 		}
	// 	)
	// 	.catch((err) => {
	// 		console.log('Error creating format:', err);
	// 		return next(new HttpError(err.errmsg, 422));
	// 	});
};




