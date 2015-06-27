var _ = require('lodash');

function user(){
	var app         = this.app;
	var middlewares = this.middlewares;
	var models      = this.models;
	var common      = this.common;
	var onlineList  = common.onlineList;
	var type        = 'user';

	// 首页
	app.get('/', middlewares.requireLogin, function(req,res){
		// res.render('index',{user:req.session.user,title:'u77club'});
		res.redirect('/index.html');
	});

	// 登陆页
	app.get('/login', middlewares.requireLogin.redirect, function(req,res){
		// res.render('login',{title:'登陆'});
		res.redirect('/index.html');
	});

	// 登陆操作
	app.post('/login', middlewares.requireLogin.redirect, function(req,res){
		var user = models.user.find(req.body,function(err,doc){
			if(doc.length == 1){
				req.session.user = doc[0];
				res.send('get it');
			}else{
				res.send('wrong.');
			}
		});
	});

	// 注册操作
	app.post('/register', middlewares.requireLogin.redirect, function(req,res){
		var user = new models.user(req.body);
		user.save(function(err){
			if(err){
				res.send('注册出错');
			}else{
				res.send('注册成功');
			}
		});
	});

	app.io.route(type,{
		self:function(req,res){
			req.socket.emit(type+':self',req.session.user);
		}
	})


}

module.exports = user;