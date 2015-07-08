var _ = require('lodash');

function user(){
	var app         = this.app;
	var middlewares = this.middlewares;
	var models      = this.models;
	var common      = this.common;
	var onlineList  = common.onlineList;
	var type        = 'user';
	var errorHandle = common.errorHandle;

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
				res.redirect('/index.html');
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
			models.user.findById(req.session.user._id).exec(errorHandle(req,type,function(user){
				req.session.user = user;
				req.session.save();
				req.socket.emit(type+':self',user);
			}))
			
		}
	})


}

module.exports = user;