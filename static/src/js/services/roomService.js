
app.service('roomList',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:list',function(data){
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
		}
	}
}]);

app.service('roomJoin',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:join',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:join',options);
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

app.service('roomLeave',['socket',function(socket){
	var _cb = {};
	socket.addListener('room:leave',function(data){
		angular.forEach(_cb,function(cb){
			cb(data);
		});
	});

	return {
		emit:function(options){
			socket.emit('room:leave',options);
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
}])