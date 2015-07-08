app.service('userSelf',['socket','$q','roomListByIds',function(socket,$q,roomListByIds){
	var _user;
	var _cb = {};

	function fresh(data){
		_user = data;
		roomListByIds.emit({_ids:data.rooms});
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	}
	socket.addListener('user:self',function(data){
		fresh(data);
	});

	socket.addListener('user:online',function(data){
		fresh(data);
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
			fresh(user);
		},
		promise:function(options){
			var deferred = $q.defer();
			socket.emit('user:selft',options);
			socket.on('user:selft',function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		}
	}
}]);