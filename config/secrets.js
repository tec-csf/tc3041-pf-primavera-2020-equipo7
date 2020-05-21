const dotenv = require('dotenv');

dotenv.config();
exports.AWS_ACCESS_KEY_ID_NODE = process.env.AWS_ACCESS_KEY_ID_NODE;
exports.AWS_SECRET_ACCESS_KEY_NODE = process.env.AWS_SECRET_ACCESS_KEY_NODE;
exports.AWS_REGION = process.env.AWS_REGION;
exports.GC_BUCKET_NAME = process.env.GC_BUCKET_NAME;
exports.GC_APPLICATION_CREDENTIALS = process.env.GC_APPLICATION_CREDENTIALS;
exports.MONGO_URI = process.env.MONGO_URI
