const fs = require('fs');

const { createCanvas, loadImage } = require('canvas');

const colors = {
	HAPPY: '#f1c40f',
	SUPRISED: '#f39c12',
	ANGRY: '#c0392b',
	CONFUSED: '#2ecc71',
	CALM: '#7f8c8d',
	SAD: '#3498db',
	FEAR: '#9b59b6',
	DISGUSTED: '#16a085'
};

exports.drawFrame = async (file, image, frame, faceDetails) => {
	const frameImage = await loadImage(file);
	const canvas = createCanvas(frameImage.width, frameImage.height);
	const context = canvas.getContext('2d');
	let emotion = '';
	let emotions = [];
	let i = 0;

	for (; i < faceDetails.length; i++) {
		emotions = faceDetails[i].Emotions.sort((a, b) => {
			if (a.Confidence < b.Confidence) {
				return 1;
			}
			if (a.Confidence > b.Confidence) {
				return -1;
			}
			return 0;
		});
		emotion = emotions[0].Type;
		context.drawImage(frameImage, 0, 0, frameImage.width, frameImage.height);
		context.beginPath();
		context.rect(
			faceDetails[i].BoundingBox.Left * frameImage.width,
			faceDetails[i].BoundingBox.Top * frameImage.height,
			faceDetails[i].BoundingBox.Width * frameImage.width,
			faceDetails[i].BoundingBox.Height * frameImage.height
		);
		context.lineWidth = 5;
		context.strokeStyle = colors[emotion];
		context.stroke();

		frame.analysis.push(faceDetails[i]);
	}

	const buffer = canvas.toBuffer('image/jpeg');
	fs.writeFileSync(file, buffer);

};
