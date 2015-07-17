var _ = require('lodash');
var errorHandle = require('../common.js').errorHandle;

function message(){
	var app          = this.app;
	var middlewares  = this.middlewares;
	var models       = this.models;
	var type         = 'message';
	var common       = this.common;
	var addOnline    = common.addOnline;
	var removeOnline = common.removeOnline;
	var onlineList   = common.onlineList;
	var errorHandle  = common.errorHandle;

	app.io.route(type,{
		new:function(req,res){
			var options = {
				room:req.param('_id'),
				sender:req.session.user._id,
				content:req.param('content')
			}
			var msg = new models.message(options);
			msg.save(errorHandle(req,type,function(){
				app.io.to(req.param('_id')).emit(type+':new',{
					sender:req.session.user,
					room:msg.room,
					date:msg.date,
					content:msg.content,
					_id:msg._id
				});
			}));
			models.room.findById(req.param('_id'),errorHandle(req,type,function(room){
				if(!room){
					req.socket.emit('system:'+type,'请先选择房间');
					return false;
				}
				if(room.messages){
					room.messages.push(msg._id);
				}else{
					room.messages = [msg._id];
				}
				room.save(errorHandle(req,type));
			}));
		},
		list:function(req,res){
			models.message.findByRoom(req.param('_id'),errorHandle(req,type,function(messages){
				req.socket.emit(type+':list',{_id:req.param('_id'),messages:messages});
			}));
		},
		private:function(req,res){
			var type = 'private message';
			models.user.findById(req.param('_id')).exec(errorHandle(req,type,function(user){
				if(user){
					var msg = new models.userMessage({
						receiver:user._id,
						sender:req.session.user._id,
						text:req.param('text')
					});
					msg.save();
					models.userRoomActive.addPrivateActive(req);
					clients = onlineList()[req.param('_id')];
					if(clients){
						// 如果在线
						_.forEach(clients,function(client){
							app.io.sockets.connected[client].emit('message:private',msg);
							req.socket.emit('message:private',msg);
						});
					}
				}else{
					req.socket.emit('message:private',{status:101,msg:'user not find'});
				}
			}));
		},
		listPrivate:function(req,res){
			var type = 'private message list';
			models.user.findById(req.param('_id')).exec(errorHandle(req,type,function(user){
				if(user){
					models.userRoomActive.addPrivateActive(req);
					models.userMessage.find({"$or":[
						{
							sender:req.session.user._id,
							receiver:user._id
						},
						{
							sender:user._id,
							receiver:req.session.user._id
						}]})
					.sort("date")
					.exec(errorHandle(req,type,function(messages){
						req.socket.emit('message:listPrivate',{user:user,list:messages});
					}));
				}else{
					req.socket.emit('message:listPrivate',{status:101,msg:'user not find'});	
				}
			}))
		},
		updateActive:function(req,res){
			models.userRoomActive.addPrivateActive(req);
		}
	});
}

module.exports = message;