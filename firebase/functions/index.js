const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (process.env.NODE_ENV !== 'production') {
  console.log('development');
  
  const serviceAccount = require("./src/keys/driveshop5-firebase-adminsdk-1x7t4-97fb0a9cd5.json"); //Call secret values
  admin.initializeApp({                                                       
    credential: admin.credential.cert(serviceAccount),                        //Init credential google
    databaseURL: "https://driveshop5.firebaseio.com/",                     //Init database url
    storageBucket: "driveshop5.appspot.com",
  });
  
}else{
  console.log('production');
  admin.initializeApp();
};

exports.trace = functions.https.onRequest( require('./src/main') );


/*

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "<BUCKET_NAME>.appspot.com"
});

var bucket = admin.storage().bucket();
*/