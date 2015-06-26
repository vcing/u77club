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

	/**
	 * 20150619
	 * 注册socket的连接和失去连接事件
	 * @param  {Object}		socket对象
	 * @return {null}
	 */
	app.io.on('connection',function(socket){
		var socket = socket;
		addOnline(socket.session.user,socket);
		socket.on('disconnect',function(){
			removeOnline(socket.session.user,socket);
		});
		socket.on('reconnect',function(){
			addOnline(socket.session.user,socket);
		})
	});


	app.io.route(type,{
		/**
		 * 20150619
		 * 获取在线列表
		 * @param  {Object} req 请求对象
		 * @param  {Object} res 响应对象
		 * @return {null}
		 */
		list:function(req,res){
			req.socket.emit(type+':list',JSON.stringify(onlineList()));
		}
	})
	
}

module.exports = connection;