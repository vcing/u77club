var onlineList = {};
var _          = require('lodash');

module.exports = {
	onlineLists : onlineList,
	/**
	 * 20150619
	 * 全局错误处理函数
	 * @param  {object}   req  请求对象
	 * @param  {string}   type 错误类型
	 * @param  {Function} cb   回调
	 * @return {null}
	 */
	errorHandle: function(req,type,cb){
		return function(err,doc){
			if(err){
				if(req){
					req.socket.emit('system:'+type,err);	
				}
				console.log(err);
			}else{
				if(cb)cb(doc);
			}
		}
	},
	/**
	 * 20150619
	 * 全局错误日志函数
	 * @param  {string} text 文本
	 * @return {null}
	 */
	errorLog:function(text){
		console.log(text);
	},
	/**
	 * 20150619
	 * 获取在线列表
	 * @return {Array} 在线列表数组
	 */
	onlineList:function(){
		return onlineList;
	},
	/**
	 * 20150619
	 * 把user和对应的socket加入在线列表
	 * @param {obj} socket socket对象
	 */
	addOnline:function(socket){
		socket.emit('user:online',socket.session.user);
		if(onlineList[socket.session.user._id]){
			onlineList[socket.session.user._id].push(socket.id);
		}else{
			onlineList[socket.session.user._id] = [socket.id];
		}
	},
	/**
	 * 20150619
	 * 把指定socket删除在线列表
	 * 如果该用户没有更多socket连接
	 * 则删除该用户 并退出该用户所有订阅的房间
	 * @param  {obj} socket socket对象
	 * @return {null}
	 */
	removeOnline:function(socket){
		if(onlineList[socket.session.user._id]){
			var clients = onlineList[socket.session.user._id];
			_.remove(clients,function(n){
				return n == socket.id;
			});
			if(clients.length == 0){
				delete onlineList[socket.session.user._id];
			}else{
				onlineList[socket.session.user._id] = clients;
			}
		}else{
			console.log(' wtf ');
		}
	}
}