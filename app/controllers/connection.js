var _            = require('lodash');

function connection(){
	var app          = this.app;
	var middlewares  = this.middlewares;
	var models       = this.models;
	var type         = 'connection';
	var common       = this.common;
	var addOnline    = common.addOnline;
	var removeOnline = common.removeOnline;
	var onlineList   = common.onlineList;
	var errorHandle  = common.errorHandle;

	app.io.on('connection',function(socket){
		var socket = socket;
		addOnline(socket.session.user,socket);
		socket.on('disconnect',function(){
			removeOnline(socket.session.user,socket);
		});
	});

	app.io.route(type,{
		list:function(req,res){
			req.socket.emit(type+':list',JSON.stringify(onlineList()));
		}
	})
	
}

module.exports = connection;