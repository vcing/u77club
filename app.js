'use strict';
var _       = require('lodash'),
express     = require('express.oi'),
mongoose    = require('mongoose'),
MongoStore  = require('connect-mongo')(express.session),
bodyParser  = require('body-parser'),
settings    = require('./settings.json'),
app         = express(),
models      = require('./app/models'),
middlewares = require('./app/middlewares'),
controllers = require('./app/controllers'),
common      = require('./app/common');

app.http().io();

var options = {server:{},replset:{}};
options.server.socketOptions  = { keepAlive: 1 };
options.replset.socketOptions = { keepAlive: 1 };
mongoose.connect(settings.mongo.url,options);


// session
app.io.session({
	key: 'connect.sid',
	store:new MongoStore({
		url:settings.mongo.url
	}),
	secret: 'dfsdfdsfsdf',
	resave: false,
	saveUninitialized: true
});

// third middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// publich
app.use(express.static(__dirname + '/static/dest', { maxAge: '364d' }));

common.setApp(app);

// 清空房间在线列表
models.room.find({}).exec(function(err,docs){
	_.forEach(docs,function(doc){
		doc.users = [];
		doc.save();
	});
});


// controllers
_.map(controllers,function(controller){
	controller.apply({
		app:app,
		middlewares:middlewares,
		models:models,
		controllers: controllers,
		common: common
	});
});


app.listen(80);