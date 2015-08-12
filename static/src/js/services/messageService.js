app.service('messageNew',['socket','messageList','activeList','activeInfo',function(socket,messageList,activeList){
	var _cb = {};
	var newActiveListener = [];

	socket.addListener('message:new',function(data){
		var _list = messageList.list(data.room);
		if(_list){
			_list.push(data);
			messageList.setList(data.room,_list);
		}

		if(data.active && !data.content){
			angular.forEach(newActiveListener,function(fn){
				fn();
			});
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
		setNewActiveListener:function(fn){
			newActiveListener.push(fn);
		}
	}
}]);

app.service('messageList',['socket',function(socket){
	var _cb      = {};
	var _list    = {};
	var _loading = {};
	socket.addListener('message:list',function(data){
		events(data);
	});

	function events(data) {
		if(data.isPrev){
			_list[data._id] = data.messages.concat(_list[data._id]);
			_loading[data._id] = false;
			if(data.messages.length == 0)_loading[data._id] = true;
		}else if(data.messages && !data.isPrev){
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
		prev:function(_id){
			var date = _list[_id][0].date;
			if(!_loading[_id]){
				socket.emit('message:list',{_id:_id,date:date});
				_loading[_id] = true;	
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

		var _cb      = {};		//存回调函数的
		var _list    = {};		//存消息列表的
		var _record  = {};		//存导航栏显示未读数目的
		var sideBarAction;		//保存侧栏信息条数更新后的函数
		var _currentId;			//当前私聊对象ID
		var _loading = {};		//保存请求状态

		function getPrivateMessages(_id){
			var deffered = $q.defer();
			socket.emit('message:listPrivate',{_id:_id});
			_cb['getPrivateMessages'] = function(data){
				_loading[data.user._id] = false;
				deffered.resolve(data);
				delete _cb['getPrivateMessages'];
			}
			return deffered.promise;
		}

		function openPrivateMessage(_id){
			_currentId = _id;
			if(_record[_id])_record[_id].count = 0;
			sideBarAction(_record);
			// var messageList = getPrivateMessages(_id);
			var createPrivateModal = $modal.open({
				animation:true,
				backdrop:false,
				templateUrl:'/message/private.html',
				controller:'messagePrivateCtrl',
				windowClass:'private-modal',
				resolve:{
					data:function(){
						return {
							getPrivateMessages:getPrivateMessages,
							_id:_id
						}
					}
				}
			});
			createPrivateModal.result.then(function(){
				_currentId = 0;
			},function(){
				_currentId = 0;
			})
			// });
		}

		socket.addListener('message:listPrivate',function(data){
			if(data.isPrev){
				_list[data.user._id] = data.list.concat(_list[data.user._id]);
				_loading[data.user._id] = false;
				if(data.list.length == 0)_loading[data.user._id] = true;
			}else{
				_list[data.user._id] = data.list;
			}
			angular.forEach(_cb,function(cb){
				cb(data);
			});
			
		});

		socket.addListener('message:private',function(data){
			var _id = data.sender == userSelf.self()._id ? data.receiver : data.sender;
			// 添加到私聊数据到缓存数组中
			if(_list[_id]){
				_list[_id].push(data)
			}else{
				_list[_id] = [data];
			}
			// 添加私聊记录
			if(_record[_id]){
				if(_id != _currentId)_record[_id].count++;
				angular.forEach(_cb,function(cb){
					cb(data);
				})
			}else{
				// 如果没有记录 则重新从服务器获取记录
				userPrivateList.promise().then(function(result){
					_record = result;
					_record[_id] = 0;
					angular.forEach(_cb,function(cb){
						cb(data);
					})
				});
			}
		});

		// 绑定到根作用域
		$rootScope.openPrivateMessage = openPrivateMessage;

		// 判断空对象
		function isEmptyObject(obj){
		    for(var n in obj){return false} 
		    return true; 
		}

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
			clearCount:function(_id){
				// 正在对话的房间
				if(_record[_id])_record[_id].count = 0;
			},
			record:function(){
				var deffered = $q.defer();
				// 从服务器获取数据 初始化未读消息条数
				if(!isEmptyObject(_record))return _record;
				userPrivateList.promise().then(function(result){
					_record = result;
					deffered.resolve(_record);
				});
				return deffered.promise;
			},
			prev:function(_id){
				var date = _list[_id][0].date;
				if(!_loading[_id]){
					socket.emit('message:listPrivate',{_id:_id,date:date});	
					_loading[_id] = true;
				}
			},
			updateActive:function(_id){
				socket.emit('message:updateActive',{_id:_id});
			},
			setSideBarAction:function(fn){
				sideBarAction = fn;
			},
			openPrivateMessage:openPrivateMessage,
		}
		
	}]);

