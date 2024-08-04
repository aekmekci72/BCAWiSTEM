// config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceKey.json'); // Replace with your Firebase service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-database-name>.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;