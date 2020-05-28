const fs = require('fs');
const { Frame } = require('../models/Frame');
const axios = require('axios');

exports.processFreeFrame = async (file) => {
	const image = fs.readFileSync(file, { encoding: 'base64' });
	// const params = {
	// 	Image: {
	// 		Bytes: Buffer.from(image, 'base64'),
	// 	},
	// 	Attributes: ['ALL']
	// };
	fData = new FormData();
	fData.append('video', file, image);
	// const result = await 
	axios({
		//headers: getCsrfHeader().headers,
		method: 'post',
		url: 'localhost:8000/imagen/clasificar',
		data: formData,
		responseType: 'arraybuffer',
		onUploadProgress: (e) => {
			// updating progress indicator
			progress(e.lengthComputable, e.loaded, e.total);
		}
	})
		.then((response) => {
			// passing the file id to Filepond
			//load(response.data.data.id);
			console.log(response);
			const base64 = btoa(
				new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
			setImageResult('data:;base64,' + base64);
		})
		.catch((err) => {
			console.log(err);
		});
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