const Cloud = require('@google-cloud/storage')
const { GC_PROJECT_ID, GC_CLIENT_EMAIL, GC_PRIVATE_KEY_ID, GC_BUCKET_NAME } = require('../config/secrets');

const { Storage } = Cloud
const gc = new Storage({
	keyFilename: __dirname + '/../emotionfy-media-277519-034f3305fd00.json'
	// credentials: {
	// 	client_email: GC_CLIENT_EMAIL,
	// 	private_key: GC_PRIVATE_KEY_ID
	// },
	// projectId: GC_PROJECT_ID
})

exports.bucket = gc.bucket(GC_BUCKET_NAME);
