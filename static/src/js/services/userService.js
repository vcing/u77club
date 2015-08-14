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
		_user = data;
		fresh(data);
	});

	// socket.addListener('user:online',function(data){
	// 	// fresh(data);
	// 	_user = data;
	// });

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
		setSelf:function(user,isInit){
			_user = user;
			if(!isInit)fresh(user);
		},
		promise:function(options){
			var deferred = $q.defer();
			socket.emit('user:self',options);
			socket.on('user:self',function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		}
	}
}]);

app.service('userPrivateList',['socket','$q',
	function(socket,$q){
		return {
			promise:function(options){
				var deffered = $q.defer();
				socket.emit('user:privateList',options);
				socket.on('user:privateList',function(data){
					deffered.resolve(data);
				});
				return deffered.promise;
			}
		}
	}]);

app.service('userInfo',['socket','$q',
	function(socket,$q){
		return {
			promise:function(_id){
				var deffered = $q.defer();
				socket.emit('user:info',{_id:_id});
				socket.on('user:info',function(data){
					deffered.resolve(data);
				});
				return deffered.promise;
			}
		}
	}]);