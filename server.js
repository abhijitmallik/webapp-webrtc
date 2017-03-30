const express = require('express');
const https = require('https');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const connec = require('./backend/connection');


var app = express();
app.set('port', 4000);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	console.log("121212121212121212121212121212121212");
    res.redirect(['https://abhijit-webrtc', req.url].join(''));
    next();
});

const server = http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port', app.get('port'));
});

connec.provideServices(server);