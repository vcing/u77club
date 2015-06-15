'use strict';

var express = require('express.oi'),
settings    = require('./settings.json'),
app         = express(),
MongoStore  = require('connect-mongo')(express.session),
mongoose    = require('mongoose'),
models      = require('./app/models');

app.http().io();

var options = {server:{},replset:{}};
options.server.socketOptions  = { keepAlive: 1 };
options.replset.socketOptions = { keepAlive: 1 };
mongoose.connect(settings.mongo.url,options);

app.io.session({
	store:new MongoStore({
		url:settings.mongo.url
	}),
	secret: 'dfsdfdsfsdf',
	resave: false,
	saveUninitialized: true
});

app.get('/',function(req,res,next){
	req.session.count++;
	res.send('count:'+req.session.count);
});

console.dir(models);

app.listen(80);