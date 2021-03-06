const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const http = require('http');

const HttpError = require('./models/HttpError');
const { MONGO_URI } = require('./config/secrets');
const { realtime } = require('./util/realtime');
// Routes
const videoRoutes = require('./routes/video');
const webhookRoutes = require('./routes/webhooks');

const app = express();
const server = http.Server(app);
realtime(server);

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp',
		preserveExtension: true
	})
);
app.use('/videos', videoRoutes);
app.use('/webhooks', webhookRoutes);
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
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log(`Connected to Mongo with URI: ${MONGO_URI}`);
	server.listen(port, () => console.log(`Listening on port ${port}...`));
}).catch(err => console.log(`Error connecting to mongo: ${err}`));
