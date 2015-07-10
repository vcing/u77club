app.service('messageNew',['socket','messageList',function(socket,messageList){
	var _cb = {};

	

	socket.addListener('message:new',function(data){
		var _list = messageList.list(data.room);
		if(_list){
			_list.push(data);
			messageList.setList(data.room,_list);
		}
		
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
		checkListener:function(name){
			if(_cb[name]){
				return true;
			}else{
				return false;
			}
		},
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

app.service('messageRemind',['$scope','socket','$q',
	function($scope,socket,$q){
		return {
			promise:function(options){
				var deffered = $q.defer();
				socket.emit('message:remind',options);
				socket.on('message:remind',function(data){
					deffered.resolve(data);
				})
				return deffered.pormise;
			}
		}
	}]);