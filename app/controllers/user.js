function user(){
	var app         = this.app;
	var middlewares = this.middlewares;
	var models      = this.models

	// 首页
	app.get('/', middlewares.requireLogin, function(req,res){
		res.send('already login');
	});

	// 登陆页
	app.get('/login', middlewares.requireLogin.redirect, function(req,res){
		res.render('login',{title:'登陆'});
	});

	// 登陆操作
	app.post('/login', middlewares.requireLogin.redirect, function(req,res){
		res.send('get it');
		console.dir(req.body);
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
}

module.exports = user;