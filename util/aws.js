const { AWS_ACCESS_KEY_ID_NODE, AWS_SECRET_ACCESS_KEY_NODE, AWS_REGION, GC_BUCKET_NAME } = require('../config/secrets');
const { Frame } = require('../models/Frame');
const aws = require('aws-sdk');
const { drawFrame } = require('./canvas');
const fs = require('fs');

const config = new aws.Config({
	accessKeyId: AWS_ACCESS_KEY_ID_NODE,
	secretAccessKey: AWS_SECRET_ACCESS_KEY_NODE,
	region: AWS_REGION
});
const client = new aws.Rekognition(config);

exports.processFrame = async (file) => {
	const image = Buffer.from(
		fs.readFileSync(file, { encoding: 'base64' }),
		'base64'
		);
	const params = {
		Image: {
			Bytes: image,
		},
		Attributes: ['ALL']
	};
	const result = await client.detectFaces(params).promise();
	const filePathArray = file.split('/');
	const fileName = filePathArray[filePathArray.length - 1];
	const frame = new Frame({
		name: fileName,
		bucket_link: `https://storage.googleapis.com/${GC_BUCKET_NAME}/${fileName}`,
		path: file,
		instant: 0,
		sequence_id: 0,
		analysis: []
	});
	try {
		drawFrame(file, image, frame, result.FaceDetails);
	} catch(err) {
		throw err;
	}

	return frame;
}
