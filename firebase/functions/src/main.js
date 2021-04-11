const express = require('express');
//const jsonex= require('json2xls');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.urlencoded({extended: false}));                
app.use(express.json()); 
//app.use(jsonex.middleware);
app.use('/APItrace', require('./routes/files.js') );    //Only accept one route

module.exports= app;
//appA.use((req, res, next) => {  res.status(404).redirect('/404.html');  });  //If user access to route not declare, this is redirect with error message