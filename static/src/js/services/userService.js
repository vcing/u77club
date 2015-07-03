app.service('userSelf',['socket',function(socket){
	var _user;
	var _cb = {};
	socket.addListener('user:self',function(data){
		_user = data;
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	socket.addListener('user:online',function(data){
		_user = data;
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
		},
		self:function(){
			return _user;
		},
		setSelf:function(user){
			_user = user;
		}
	}
}]);