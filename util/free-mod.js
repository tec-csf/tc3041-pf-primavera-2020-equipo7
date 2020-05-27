const fs = require('fs');
const { Frame } = require('../models/Frame');
const axios = require('axios');

exports.processFreeFrame = async (file) => {
	const image = fs.readFileSync(file, { encoding: 'base64' });
	const params = {
		Image: {
			Bytes: Buffer.from(image, 'base64'),
		},
		Attributes: ['ALL']
    };
	const result = await axios.get('localhost:8000/imagen/clasificar/');
	const filePathArray = file.split('/');
	const fileName = filePathArray[filePathArray.length - 1];
	const frame = new Frame({
		name: fileName,
		bucket_link: `https://storage.googleapis.com/${GC_BUCKET_NAME}/${fileName}`,
		path: file,
		instant: 0,
		sequence_id: 0
	});

	return frame;
}