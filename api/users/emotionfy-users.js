const express = require('express');
const mongoose = require('mongoose');
const devise = require('mongoose-device');
const faker = require('faker');

const dbLink = require('./config/keys').mongoURI;

const app = express();
app.use(express.json());

//conection + error handling
mongoose
	.connect(dbLink, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.then(() => {
		console.log('Connected to the DB!');
		//check collections
		//console.log(Object.keys(mongoose.connection.collections));
	})
	.catch((err) => {
		console.log(`DB connection Error: ${err.message}`);
	});

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

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));