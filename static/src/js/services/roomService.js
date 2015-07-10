app.service('roomInfo',['socket','$q','roomUpdateActive',function(socket,$q,roomUpdateActive){
	var _list = {};
	var _cb = {};
	var _current = '';
	var _sideBarAction;
	socket.addListener('room:info',function(data){
		_list[data._id] = data;
		angular.forEach(_cb[data._id],function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:info',options);	
		},
		addListener:function(name,_id,cb){
			if(!_cb[_id])_cb[_id]={};
			_cb[_id][name] = cb;
		},
		removeListener:function(name,_id){
			delete _cb[_id][name];
		},
		checkListener:function(name,_id){
			if(_cb[_id] && _cb[_id][name]){
				return true;
			}else{
				return false;
			}
		},
		on:function(name,_id,cb){
			_cb[_id][name] = function(data){
				delete _cb[_id][name];
				cb(data);
			}
		},
		info:function(_id){
			// 因为每次切换房间
			// 必定会执行这个函数
			// 所以在这里处理 侧栏的消息提醒数目
			if(_sideBarAction)_sideBarAction(_id);
			if(_id != 'list')roomUpdateActive.emit({_id:_id});
			return _list[_id];
		},
		promise:function(options){
			var deferred = $q.defer();
			socket.emit('room:info',options);
			socket.on('room:info',function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		},
		setSideBarAction:function(fn){
			_sideBarAction = fn;
		}
	}
}]);

app.service('roomListByIds',['socket',function(socket){
	var _cb = {};

	socket.addListener('room:listbyids',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:listbyids',options);
		},
		addListener:function(name,cb){
			_cb[name] = cb;
		},
		removeListener:function(name){
			delete _cb[name];
		},
		checkListener:function(name){
			if(_cb[name]){
				return true;
			}else{
				return false;
			}
		},
	}
}]);


app.service('roomList',['socket',function(socket){
	var _list = [];
	var _cb = {};
	socket.addListener('room:list',function(data){
		_list = data;
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:list',options);	
		},
		addListener:function(name,cb){
			_cb[name] = cb;
		},
		removeListener:function(name){
			delete _cb[name];
		},
		checkListener:function(name){
			if(_cb[name]){
				return true;
			}else{
				return false;
			}
		},
		on:function(name,cb){
			_cb[name] = function(data){
				delete _cb[name];
				cb(data);
			}
		},
		list:function(){
			return _list;
		}
	}
}]);

app.service('roomJoin',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:join',function(data){
		angular.forEach(_cb[data._id],function(cb){
			cb(data.user);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:join',options);
		},
		addListener:function(name,_id,cb){
			if(!_cb[_id])_cb[_id] = {};
			_cb[_id][name] = cb;
		},
		removeListener:function(name,_id){
			delete _cb[_id][name];
		},
		checkListener:function(name,_id){
			if(_cb[_id] && _cb[_id][name]){
				return true;
			}else{
				return false;
			}
		},
		on:function(name,_id,cb){
			if(!_cb[_id])_cb[_id] = {};
			_cb[_id][name] = function(data){
				delete _cb[_id][name];
				cb(data);
			}
		}
	}
}]);

app.service('roomLeave',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:leave',function(data){
		angular.forEach(_cb[data._id],function(cb){
			cb(data.user);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:leave',options);
		},
		addListener:function(name,_id,cb){
			if(!_cb[_id])_cb[_id] = {};
			_cb[_id][name] = cb;
		},
		removeListener:function(name,_id){
			delete _cb[_id][name];
		},
		checkListener:function(name,_id){
			if(_cb[_id] && _cb[_id][name]){
				return true;
			}else{
				return false;
			}
		},
		on:function(name,_id,cb){
			if(!_cb[_id])_cb[_id] = {};
			_cb[_id][name] = function(data){
				delete _cb[_id][name];
				cb(data);
			}
		}
	}
}]);

app.service('roomSubscribe',['socket','userSelf','roomList','$q',function(socket,userSelf,roomList,$q){
	var _cb = {};
	socket.addListener('room:subscribe',function(data){
		userSelf.emit();
		roomList.emit();
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:subscribe',options);
		},
		addListener:function(name,cb){
			_cb[name] = cb;
		},
		removeListener:function(name){
			delete _cb[name];
		},
		checkListener:function(name){
			if(_cb[name]){
				return true;
			}else{
				return false;
			}
		},
		on:function(name,cb){
			_cb[name] = function(data){
				delete _cb[name];
				cb(data);
				
			}
		},
		promise:function(options){
			var deferred = $q.defer();
			socket.emit('room:subscribe',options);
			socket.on('room:subscribe',function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		}
	}
}]);

app.service('roomCreate',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:create',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:create',options);
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

app.service('roomDelete',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:delete',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:delete',options);
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

app.service('roomValid',['socket','$q',
	function(socket,$q){
		return function(options){
			var deferred = $q.defer();
			socket.on('room:valid',function(data){
				deferred.resolve(data);
			});
			socket.emit('room:valid',options);
			return deferred.promise;
		}
	}]);

app.service('permissionValid',['socket','$q',
	function(socket,$q){
		return function(options){
			var deferred = $q.defer();
			socket.on('room:permission',function(data){
				deferred.resolve(data);
			});
			socket.emit('room:permission',options);
			return deferred.promise;
		}
	}]);
	

app.service('roomUserList',['socket',function(socket){
	var _list = {};
	var _cb = {};
	socket.addListener('room:userlist',function(data){
		_list[data._id] = data;
		angular.forEach(_cb[data._id],function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:userlist',options);
		},
		addListener:function(name,_id,cb){
			if(!_cb[_id])_cb[_id] = {};
			_cb[_id][name] = cb;
		},
		removeListener:function(name,_id){
			delete _cb[_id][name];
		},
		checkListener:function(name,_id){
			if(_cb[_id] && _cb[_id][name]){
				return true;
			}else{
				return false;
			}
		},
		on:function(name,_id,cb){
			if(!_cb[_id])_cb[_id] = {};
			_cb[_id][name] = function(data){
				delete _cb[_id][name];
				cb(data);
			}
		},
		list:function(_id){
			return _list[_id];
		}
	}
}]);

app.service('roomUpdateActive',['socket',
	function(socket){
		return {
			emit:function(options){
				socket.emit('room:updateactive',options);
			}
		}
	}]);