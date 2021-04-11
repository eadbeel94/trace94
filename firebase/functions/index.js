const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (process.env.NODE_ENV !== 'production') {
  console.log('development');
  const serviceAccount = require("./src/keys/driveshop5-firebase-adminsdk-1x7t4-97fb0a9cd5.json"); //Call secret values
  const { databaseURL , storageBucket } = require("./src/keys/main.json");
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL, storageBucket });
}else{
  console.log('production');
  admin.initializeApp();
};

exports.trace = functions.https.onRequest( require('./src/main') );