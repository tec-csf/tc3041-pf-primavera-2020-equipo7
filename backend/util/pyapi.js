const fs = require('fs');
const { Frame } = require('../models/Frame');
const axios = require('axios');
const FormData = require('form-data');
const { GC_BUCKET_NAME } = require('../config/secrets');

exports.processFreeFrame = async (file) => {
	const fData = new FormData();
	const image = fs.createReadStream(file);

	fData.append('image', image, 'image.jpg');

	try {
		const result = await axios.post('/pyapi/imagen/clasificar', fData, {
			headers: fData.getHeaders(), 
			responseType: 'arraybuffer'
		});
		//console.log(result);
		fs.writeFileSync(file, result.data)
	} catch (err) {
		console.log(err);
	}

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
};
