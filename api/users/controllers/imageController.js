const HttpError = require('../models/http-error');
const userSchema = require('../models/videos');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const devise = require('mongoose-devise');
const ObjectId = mongoose.Types.ObjectId;
const imageCollection = mongoose.model('video', userSchema, 'videos');

// Create new image from a video or a single frame
exports.image_create = function (req, res, next) {
	console.log('Adding a new frame');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}

	// new imageCollection({
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

// Delete image
exports.image_delete = function (req, res, next) {
    console.log('Deleting a frame');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new imageCollection({
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

// Update image
exports.image_update = function (req, res, next) {
    console.log('Deleting a frame');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new imageCollection({
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

// image details
exports.image_detail = function (req, res, next) {
    console.log('Deleting a frame');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new imageCollection({
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

// image list (from the same video)
exports.image_list = function (req, res, next) {
    console.log('Deleting a frame');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new imageCollection({
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

// image search necessary?
exports.image_search = function (req, res, next) {
    console.log('Deleting a frame');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new imageCollection({
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
    console.log('Deleting a frame');
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid request, check your data', 422));
	}

	try {
		console.log(ObjectId(req.params.id));
	} catch (_) {
		return next(new HttpError('Invalid id', 404));
	}
	// new imageCollection({
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
