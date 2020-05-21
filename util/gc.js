const Cloud = require('@google-cloud/storage')
const { GC_APPLICATION_CREDENTIALS, GC_BUCKET_NAME } = require('../config/secrets');

const { Storage } = Cloud
const gc = new Storage({
	keyFilename: GC_APPLICATION_CREDENTIALS
});

exports.bucket = gc.bucket(GC_BUCKET_NAME);
