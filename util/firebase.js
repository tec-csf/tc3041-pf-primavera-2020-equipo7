const admin = require('firebase-admin');
const { FIREBASE_CONFIG } = require('../config/secrets');

module.exports = admin.initializeApp(FIREBASE_CONFIG);
