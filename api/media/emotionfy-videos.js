const express = require('express');
const mongoose = require('mongoose');
const devise = require('mongoose-devise');
const path = require('path');
const {createWriteStream} = require('fs');
const {Storage} = require('@google-cloud/storage');

// const dbLink = require('./config/keys').mongoURI;

const app = express();
app.use(express.json());

//=====================uncomment for mongo connection:=============
//conection + error handling
// mongoose
// 	.connect(dbLink, {
// 		useUnifiedTopology: true,
// 		useNewUrlParser: true
// 	})
// 	.then(() => {
// 		console.log('Connected to the DB!');
// 		//check collections
// 		//console.log(Object.keys(mongoose.connection.collections));
// 	})
// 	.catch((err) => {
// 		console.log(`DB connection Error: ${err.message}`);
// 	});

 //setting Google Cloud Storage credentials
const gc = new Storage({
	keyFilename: path.join(__dirname, '/emotionfy-media-277519-034f3305fd00.json'),
	projectId: 'emotionfy-media-277519'
});

// gc.getBuckets().then(x => console.log(x)); 

const videosBucket = gc.bucket('staging.emotionfy-media-277519.appspot.com');

const resolvers = {
	Query: {
		files: () => files
	},
	Mutation: {
		uploadFile: async (_, {file}) => {
			const {createReadStream, filename} = await file;

			await new Promise(res =>
				createReadStream()
					.pipe(
						videosBucket.file(filename).createWriteStream({
							resumable: false, //better for files <10MB
							gzip: true
						})
					)
					.on('finish', res)		
				);

				files.push(filename);

				return true;
		}
	}
};

//=====================User registration
// User.register({
//     email: faker.internet.email(),
//     password: faker.internet.password()
// })
// .then(user)
// .catch(error)


//===================CONfirming token from user
// User.confirm('confirmation-token-valid')
//   .then(user)
//   .catch(error)

//or
// user.confirm()
// .then(isConfirmed)
// .catch(error)

//=======================User auth
// user.authenticate('secret')
//   .then(isAuthenticated)
//   .catch(error)

//OR
// const credentials = {
//     email: faker.internet.email(),
//     password: faker.internet.password()
//   }

//   User.authenticate(credentials)
//   .then(user)
//   .catch(error)

// app.use(cors())
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));