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

app.service('messageRemind',['socket','$q',
	function(socket,$q){
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

app.service('messagePrivate',['socket','$rootScope','$q','$modal','userSelf','userPrivateList',
	function(socket,$rootScope,$q,$modal,userSelf,userPrivateList){

		var _cb = {};		//存回调函数的
		var _list = {};		//存消息列表的
		var _count = {};	//存导航栏显示未读数目的

		// 从服务器获取数据 初始化未读消息条数
		userPrivateList.promise().then(function(result){
			_count = result;
		});

		function getPrivateMessages(_id){
			var deffered = $q.defer();
			socket.emit('message:listPrivate',{_id:_id});
			socket.on('message:listPrivate',function(data){
				_list[_id] = data.list;
				deffered.resolve(data);
			});
			return deffered.promise;
		}

		function openPrivateMessage(_id){
			var messageList = getPrivateMessages(_id);
				messageList.then(function(data){
				var createPrivateModal = $modal.open({
					animation:true,
					templateUrl:'/message/private.html',
					controller:'messagePrivateCtrl',
					windowClass:'private-modal',
					resolve:{
						list:function(){
							return data.list;
						},
						user:function(){
							return data.user;
						}
					}
				});	
			});
			
		}

		socket.addListener('message:private',function(data){
			var _id = data.sender == userSelf.self()._id ? data.receiver : data.sender;
			if(_list[_id]){
				_list[_id].push(data)
			}else{
				_list[_id] = [data];
			}
			angular.forEach(_cb,function(cb){
				cb(data);
			})
		})

		$rootScope.openPrivateMessage = openPrivateMessage;

		return {
			
			emit:function(options){
				socket.emit('message:private',options);
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
			list:function(_id){
				return _list[_id];
			},
			chatting:function(_id){
				// 正在对话的房间
			},
			count:function(){
				return _count;
			},
			openPrivateMessage:openPrivateMessage,
		}
		
	}]);

