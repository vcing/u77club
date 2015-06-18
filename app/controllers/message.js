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
			models.room.findById(req.param('_id'),errorHandle(req,type,function(room){
				if(!room){
					req.socket.emit('system:'+type,'请先选择房间');
					return false;
				}
				var msg = new models.message(options);
				msg.save(errorHandle(req,type));
				if(room.messages){
					room.messages.push(msg._id);
				}else{
					room.messages = [msg._id];
				}
				room.save(errorHandle(req,type));
				app.io.to(room._id).emit(type+':new',msg);
			}));
		},
		list:function(req,res){
			models.message.findByRoom(req.param('_id'),errorHandle(req,type,function(messages){
				req.socket.emit(type+':list',messages);
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