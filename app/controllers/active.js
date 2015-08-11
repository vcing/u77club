var _           = require('lodash');

function active(){
	var app          = this.app;
	var middlewares  = this.middlewares;
	var models       = this.models;
	var type         = 'active';
	var common       = this.common;
	var addOnline    = common.addOnline;
	var removeOnline = common.removeOnline;
	var onlineList   = common.onlineList;
	var errorHandle  = common.errorHandle;
	var emit		 = common.emit;
	var join		 = common.join;
	var leave		 = common.leave;

	app.io.route(type,{
		new:function(req,res){
			var options = {
				room:req.param('_id'),
				sender:req.session.user._id,
				title:req.param('title'),
				content:req.param('content')
			}
			var active = new models.active(options);
			active.save(errorHandle(req,type,function(){
				var _options = {
					room:req.param('_id'),
					sender:req.session.user._id,
					content:'',
					active:active._id
				}
				var msg = new models.message(_options);
				msg.save(errorHandle(req,type,function(){
					app.io.to(req.param('_id')).emit('message:new',{
						sender:req.session.user,
						room:msg.room,
						date:msg.date,
						active:active,
						_id:msg._id
					});
				}));
			}));
		},
		list:function(req,res){
			if(req.param('roomId')){
				models.active.findByRoom(req.param('roomId')).then(function(actives){
					req.socket.emit(type+':list',{_id:req.param('roomId'),actives:actives});
				});	
			}else if(req.param('userId')){
				models.active.findBySender(req.param('userId')).then(function(actives){
					req.socket.emit(type+':list',{_id:req.param('userId'),actives:actives});
				});
			}
		},
		info:function(req,res){
			models.active.findById(req.param('_id')).populate('sender').exec(errorHandle(req,type,function(active){
				req.socket.emit(type+':info',active);
			}));
		},
		support:function(req,res){

		},
		repost:function(req,res){

		},
		collect:function(req,res){

		},
		comment:function(req,res){
			if(req.param('content')){
				// 如果有内容则为发评论
				models.active.findById(req.param('_id')).exec(errorHandle(req,type,function(active){
					if(!active){
						return false;
					}
					var options = {
						room:active.room,
						active:req.param('_id'),
						sender:req.session.user._id,
						content:req.param('content')
					}
					var msg = new models.message(options);
					msg.save(errorHandle(req,type,function(){
						// 聊天室内显示动态的评论
						// app.io.to(active.room).emit('message:new',{
						// 	sender:req.session.user,
						// 	room:msg.room,
						// 	date:msg.date,
						// 	content:msg.content,
						// 	_id:msg._id,
						// 	active:active
						// });
					}));	
				}));
			}else{
				// 否则为获取评论
				models.message.findByActive(req.param('_id'),errorHandle(req,type,function(messages){
					req.socket.emit('active:comment',messages);
				}));
			}
		}
	});
}

module.exports = active;