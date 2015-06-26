
app.service('roomList',['socket',function(socket){
	var _cb;
	socket.on('room:list',function(data){
		if(_cb)_cb(data);
	});	
	return function(cb){
		_cb = cb;
		socket.emit('room:list');
	};
}]);

app.service('roomJoin',['socket',function(socket){
	var _cb;
	socket.on('room:join',function(data){
		if(_cb)_cb(data);
	})
	return function(_id,cb){
		_cb = cb;
		socket.emit('room:join',{_id:_id});
	}
}]);

app.service('roomLeave',['socket',function(socket){
	var _cb;
	socket.on('room:leave',function(data){
		if(_cb)_cb(data);
	})
	return function(_id,cb){
		_cb = cb;
		socket.emit('room:leave',{_id:_id});
	}
}]);

app.service('roomSubscribe',['socket',function(socket){
	var _cb;
	socket.on('room:subscribe',function(data){
		if(_cb)_cb(data);
	});
	return function(_id,cb){
		_cb = cb;
		socket.emit('room:subscribe',{_id:_id});
	}
}]);

app.service('roomCreate',['socket',function(socket){
	var _cb;
	socket.on('room:create',function(data){
		if(_cb)_cb(data);
	});
	return function(options,cb){
		_cb = cb;
		socket.emit('room:create',options);
	}
}]);

app.service('roomDelete',['socket',function(socket){
	var _cb;
	socket.on('room:delete',function(data){
		if(_cb)_cb(data);
	});
	return function(_id,cb){
		_cb = cb;
		socket.emit('room:delete',{_id:_id});
	}
}])