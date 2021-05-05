const { https }= require('firebase-functions');
const { initializeApp , credential } = require('firebase-admin');

if (process.env.NODE_ENV !== 'production') {
  console.log('development');
  const serviceAccount = require("./keys/driveshop5-firebase-adminsdk-1x7t4-97fb0a9cd5.json"); //Call secret values
  const { databaseURL , storageBucket } = require("./keys/main.json");
  initializeApp({ credential: credential.cert(serviceAccount), databaseURL, storageBucket });
}else{
  console.log('production');
  initializeApp();
};

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.urlencoded({extended: false}));                
app.use(express.json()); 

const APItrace= require('./src/main.js');
for (const key in APItrace) app.use( `/api/${ APItrace[key][0] }` , require(`./src/routes/${ APItrace[key][1] }`) )
//app.use('/APItrace', require('./routes/files.js') );    //Only accept one route
//app.use((req, res, next) => {  res.status(404).redirect('/404.html');  });  //If user access to route not declare, this is redirect with error message

exports.api = https.onRequest( app );