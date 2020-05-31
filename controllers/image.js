const HttpError = require('../models/HttpError');
const path = require('path');
const Frame = require('../models/Frame');

//TODO Add normal post
exports.postImage = async (req, res, next) => {
	const user = req.user;

	if (!req.files || !req.files.image) {
		return next(new HttpError('No image sent', 422));
	}

	const imageInput = req.files.image;

	if (imageInput.mimetype !== 'image/png' || imageInput.mimetype !== 'image/jpeg' || imageInput.name.indexOf(' ') !== -1) {
		return next(new HttpError('The image format or name is wrong', 422));
	}
	const frame = await new Frame();

	const uploadsPath = path.join(path.resolve('.'), user);

	if (!fs.existsSync(uploadsPath)) {
		fs.mkdirSync(uploadsPath, {
			recursive: true
		});
	}

	const filepath = path.join(uploadsPath, `${frame.id}_image.${imageInput.mimetype.split('/')[1]}`);
	try {
		await req.files.image.mv(filepath);
		const image = await ffmpeg(image);

		frame.user = user;
		frame.name = imageInput.name;
		frame.payment_id = null;
		frame.bucket_link =  '';
		frame.local_link = filepath;
		frame.analysis = [];
		await frame.save();

		res.status(200).send({
			image_id: frame._id
		});
	} catch (err) {
		next(new HttpError('Error while checking duration of image.', 422));
	}
};

//TODO Add analyze post
exports.postImageAnalysis = async (req, res, next) => {
	const user = req.user;
	const imageId = req.params.image_id;
	const seconds = req.body.seconds;

	const image = await image.findById(imageId);
	image.applied_seconds = seconds;
	if (image.user !== user) {
		return next(new HttpError('The image does not belong to the specified user', 403));
	}
	try {
		await processFreeFrame(image);
	} catch (err) {
		return next(new HttpError('Error while analyzing image', 403));
	}

	res.status(200).send({ message: 'Analysis done' });
};
