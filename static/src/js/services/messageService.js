// app.service('messageNew',[function(){
// 	return function(options){
// 		socket.emit('message:new',options);
// 	}
// }])


app.service('messageNew',['socket',function(socket){
	var _cb = {};
	socket.addListener('message:new',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('message:new',options);
		},
		addListener:function(name,cb){
			_cb[name] = cb;
		},
		removeListener:function(name){
			delete _cb[name];
		},
		on:function(name,cb){
			_cb[name] = function(data){
				delete _cb[name];
				cb(data);
			}
		}
	}
}]);

app.service('messageList',['socket',function(socket){
	var _cb = {};
	socket.addListener('message:list',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('message:list',options);
		},
		addListener:function(name,cb){
			_cb[name] = cb;
		},
		removeListener:function(name){
			delete _cb[name];
		},
		on:function(name,cb){
			_cb[name] = function(data){
				delete _cb[name];
				cb(data);
			}
		}
	}
}]);