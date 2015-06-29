app.service('messageNew',['socket','messageList',function(socket,messageList){
	socket.addListener('message:new',function(data){
		var _list = messageList.list(data.room);
		_list.push(data);
		messageList.setList(data.room,_list);
	});

	return {
		emit:function(options){
			socket.emit('message:new',options);
		}
	}
}]);

app.service('messageList',['socket',function(socket){
	var _cb = {};
	var _list = {};
	socket.addListener('message:list',function(data){
		events(data);
	});

	function events(data) {
		if(data.messages){
			_list[data._id] = data.messages;	
		}
		console.log(_list);
		angular.forEach(_cb[data._id],function(cb){
			cb(_list[data._id]);
		});
	}

	return {
		emit:function(options){
			socket.emit('message:list',options);
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
			_cb[_id][name] = function(data){
				delete _cb[_id][name];
				cb(data.messages);
			}
		},
		list:function(_id){
			return _list[_id];
		},
		setList:function(_id,list){
			_list[_id] = list;
			var data = {_id:_id};
			events(data);
		}
	}
}]);