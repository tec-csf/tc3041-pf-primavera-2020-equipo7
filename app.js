const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const path = require('path');

const HttpError = require('./models/HttpError');

// Routes
const imageRoutes = require('./routes/image');
const videoRoutes = require('./routes/video');

const app = express();

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	fileUpload({
		debug: true,
		// createParentPath: true,
		useTempFiles: true,
		tempFileDir: '/tmp/', //path.join(__dirname, '/uploads'),
		preserveExtension: true
	})
);
app.use('/images', imageRoutes);
app.use('/videos', videoRoutes);
app.use((req, res, next) => {
	next(new HttpError('Could not find this route', 404));
});
app.use((error, _, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500).json({ message: error.message || 'Something went wrong in the server' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));