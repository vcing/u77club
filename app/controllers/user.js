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
				console.log(err);
				res.send('注册出错');
			}else{
				req.session.user = user;
				req.session.save();
				res.redirect('/index.html');
			}
		});
	});
	app.get('/logout',function(req,res){
		delete req.session["user"];
		req.session.save();
		res.redirect('/login.html');
	})

	app.io.route(type,{
		self:function(req,res){
			models.user.findById(req.session.user._id).exec(errorHandle(req,type,function(user){
				req.session.user = user;
				req.session.save();
				req.socket.emit(type+':self',user);
			}))
		},
		privateList:function(req,res){
			var type = 'privateList';
			models.userRoomActive.getPrivateMessageRemind(req,function(result){
				var _users = [];
				var _result = {};
				_.forEach(result,function(data,index){
					if(index != 'undefined')_users.unshift(index);
				});
				if(_users.length == 0){
					req.socket.emit('user:privateList',_result);
					return;
				}
				models.user.find({_id:{"$in":_users}}).exec(errorHandle(req,type,function(users){
					_.forEach(users,function(user){
						_result[user._id] = {
							count:result[user._id],
							user:user
						}
					});
					req.socket.emit('user:privateList',_result);
				}));
			});
		}
	})


}

module.exports = user;