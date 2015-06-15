function user(){
	var app = app;
	var middlewares = middlewares;

	// 首页
	app.get('/',middlewares.reuireLogin,function(req,res){
		res.send('already login');
	});

	// 登陆页
	app.get('/login',middlewares.requireLogin.redirect,function(req,res){
		res.render('login',{title:'登陆'});
	});

	// 登陆操作
	app.post('/login',middlewares.requireLogin.redirect,function(req,res){
		
	});

	// 注册操作
	app.post('/register',middlewares.requireLogin.redirect,function(req,res){

	});
}