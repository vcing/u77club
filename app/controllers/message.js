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
			clients = onlineList()[req.param('_id')];
			_.forEach(clients,function(client){
				req.socket.broadcast.to(client).emit('message:private',req.param('content'));
			});
			
		}
	});
}

module.exports = message;