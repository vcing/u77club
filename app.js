/**
 * 		u77.club
 */

var _        = require('lodash'),
fs           = require('fs'),
express      = require('express.io'),
http         = require('http'),
mongoose     = require('mongoose'),
connectMongo = require('connect-mongo'),
cookieParser = require('cookie-parser'),
cookieParser = require('body-parser'),
session      = require('express-session'),
settings	 = require('./settings');


var MongoStore = connectMongo(session),
	connection = mongoose.createConnection(settings.mongodb.uri),
	app		   = express().http().io();

app.use(session({
	secret: 'sdlkfljfdksfckleoirqpwoqo',
	store: new MongoStore({ mongooseConnection: connection }),
	resave: false,
	saveUninitialized: true
}));


app.set('view engine', 'ejs');
app.set('views', './views');

// test
app.get('/',function(req,res){
	req.session.count++;
	res.send('count:'+req.session.count);
})

app.listen(80);