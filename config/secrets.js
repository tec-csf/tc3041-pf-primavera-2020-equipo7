const dotenv = require('dotenv');

dotenv.config();

exports.GC_PROJECT_ID = process.env.GC_PROJECT_ID;
exports.GC_CLIENT_EMAIL = process.env.GC_CLIENT_EMAIL;
exports.GC_PRIVATE_KEY_ID = process.env.GC_PRIVATE_KEY_ID;
exports.GC_BUCKET_NAME = process.env.GC_BUCKET_NAME;

