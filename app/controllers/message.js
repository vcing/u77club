
var common = require('../common.js');

function message(){
	var app         = this.app;
	var middlewares = this.middlewares;
	var models      = this.models;
	var type        = 'message';

	app.io.route(type,{
		new:function(req,res){
			var options = {
				room:req.param('_id'),
				sender:req.session.user._id,
				content:req.param('content')
			}
			models.room.findById(req.param('_id'),common.errorHandle(req,type,function(room){
				if(!room){
					req.socket.emit('system:'+type,'请先选择房间');
					return false;
				}
				var msg = new models.message(options);
				msg.save(common.errorHandle(req,type));
				if(room.messages){
					room.messages.push(msg._id);
				}else{
					room.messages = [msg._id];
				}
				room.save(common.errorHandle(req,type));
				app.io.to(room._id).emit(type+':new',msg);
			}));
		},
		list:function(req,res){
			models.message.findByRoom(req.param('_id'),common.errorHandle(req,type,function(messages){
				req.socket.emit(type+':list',messages);
			}));
		}
	});
}

module.exports = message;