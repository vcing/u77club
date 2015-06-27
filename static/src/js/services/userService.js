app.service('userSelf',['socket',function(socket){
	var _cb = {};
	socket.addListener('user:self',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('user:self',options);
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