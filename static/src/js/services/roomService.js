app.service('roomInfo',['socket',function(socket){
	var _list = {};
	var _cb = {};
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
			return _list[_id];
		}
	}
}]);

app.service('roomListByIds',['socket',function(socket){
	var _cb = {};

	socket.addListener('room:list',function(data){
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
			cb(data);
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
			cb(data);
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
		on:function(name,_id,cb){
			if(!_cb[_id])_cb[_id] = {};
			_cb[_id][name] = function(data){
				delete _cb[_id][name];
				cb(data);
			}
		}
	}
}]);

app.service('roomSubscribe',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:subscribe',function(data){
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
		on:function(name,cb){
			_cb[name] = function(data){
				delete _cb[name];
				cb(data);
				
			}
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

app.service('roomUserList',['socket',function(socket){
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