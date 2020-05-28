const fs = require('fs');

const { createCanvas, loadImage } = require('canvas');

const colors = {
	HAPPY: '#F1C40F',
	SURPRISED: '#F3A512',
	ANGRY: '#C0392B',
	CONFUSED: '#2EC971',
	CALM: '#7F8C8D',
	SAD: '#3498C9',
	FEAR: '#9B59B6',
	DISGUSTED: '#16A085'
};

exports.drawFrame = async (file, frame, faceDetails) => {
	const frameImage = await loadImage(file);
	const canvas = createCanvas(frameImage.width, frameImage.height);
	const context = canvas.getContext('2d');
	let emotion = '';
	let emotions = [];
	let i = 0;
	
	context.drawImage(frameImage, 0, 0, frameImage.width, frameImage.height);
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
