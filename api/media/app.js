const express = require('express');
const mongoose = require('mongoose');


// const dbLink = require('./config/keys').mongoURI;

const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const cors = require('cors');

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


// const resolvers = {
// 	Query: {
// 		files: () => files
// 	},
// 	Mutation: {
// 		uploadFile: async (_, {file}) => {
// 			const {createReadStream, filename} = await file;

// 			await new Promise(res =>
// 				createReadStream()
// 					.pipe(
// 						videosBucket.file(filename).createWriteStream({
// 							resumable: false, //better for files <10MB
// 							gzip: true
// 						})
// 					)
// 					.on('finish', res)		
// 				);

// 				files.push(filename);

// 				return true;
// 		}
// 	}
// };

const imageRoutes = require('./routes/imageRoutes');

app.use(cors());
app.use('/', imageRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));