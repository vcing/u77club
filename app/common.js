var onlineList = {};
var _          = require('lodash');

module.exports = {
	onlineLists : onlineList,
	errorHandle: function(req,type,cb){
		return function(err,doc){
			if(err){
				req.socket.emit('system:'+type,err);
				console.log(err);
			}else{
				if(cb)cb(doc);
			}
		}
	},
	errorLog:function(text){
		console.log(text);
	},
	onlineList:function(){
		return onlineList;
	},
	addOnline:function(user,socket){
		if(onlineList[user._id]){
			onlineList[user._id].push(socket.id);
		}else{
			onlineList[user._id] = [socket.id];
		}
	},
	removeOnline:function(user,socket){
		if(onlineList[user._id]){
			var clients = onlineList[user._id];
			_.remove(clients,function(n){
				return n == socket.id;
			});
			if(clients.length == 0){
				delete onlineList[user._id];
			}else{
				onlineList[user._id] = clients;
			}
		}else{
			console.log(' wtf ');
		}
	}
}