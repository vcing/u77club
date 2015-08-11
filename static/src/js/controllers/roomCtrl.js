app.controller('roomListCtrl',['$scope','$state','roomList','roomListByIds','userSelf','roomSubscribe','$modal','roomInfo',
	function($scope,$state,roomList,roomListByIds,userSelf,roomSubscribe,$modal,roomInfo){
	var _name = 'roomlistCtrl';
	if(roomList.checkListener(_name)){
		$scope.roomList = roomList.list();
	}else{
		roomList.addListener(_name,function(data){
			angular.forEach(data,function(room){
				if($.inArray(room._id,userSelf.self().rooms) != -1){
					room.isSubscribe = true;
				}
			});
			$scope.roomList = data;
		});
		roomList.emit();
	}


	$scope.toggleSubscript = function(_id,hasPassword){
		var options = {_id:_id};
		if(hasPassword){
			options.hasPassword = hasPassword;
		}
		roomSubscribe.emit(options);
	}

	$scope.showCreateRoom = function(){
		// $('#create-room').modal('show');
		var createRoomModal = $modal.open({
			animation:true,
			templateUrl:'/room/create.html',
			controller:'roomAddCtrl'
		});
	}

	$scope.validSubscript = function(_id,name,isSubscribe){
		if(isSubscribe){
			$scope.toggleSubscript(_id,true);
			return true;
		}

		var validSubscriptModal = $modal.open({
			animation:true,
			templateUrl:'/room/valid.html',
			controller:'roomValidCtrl',
			resolve:{
				name:function(){
					return name;
				},
				_id:function(){
					return _id;
				},
				action:function(){
					return '订阅';
				}
			}
		});

		validSubscriptModal.result.then(function(data){
				angular.forEach($scope.roomList,function(room){
					if(room._id == data._id){
						$scope.toggleSubscript(data._id,true);
					}
				});
			})
	}

	$scope.valid = function(_id,name,isSubscribe){
		if(isSubscribe){
			$state.go("main.room",{roomId:_id});
			return true;
		}
		var validModal = $modal.open({
			animation:true,
			templateUrl:'/room/valid.html',
			controller:'roomValidCtrl',
			resolve:{
				name:function(){
					return name;
				},
				_id:function(){
					return _id;
				},
				action:function(){
					return '进入';
				}
			}
		});

		validModal.result.then(function(data){
			$state.go("main.room",{roomId:data._id});
		})
	}

	
}]);

app.controller('roomValidCtrl',['$scope','roomValid','$modalInstance','name','_id','action',
	function($scope,roomValid,$modalInstance,name,_id,action){
		$scope.name = name;
		$scope.action = action;
		$scope.password = '';

		$scope.submit = function(){
			roomValid({_id:_id,password:$scope.password}).then(function(data){
				if(data.status == 0){
					$modalInstance.close(data);
				}else{
					alert('密码错误');
				}
			});
			
		}

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}
	}]);

app.controller('roomAddCtrl',['$scope','roomCreate','roomList','$state','$modalInstance',
	function($scope,roomCreate,roomList,$state,$modalInstance){
	var _name = 'roomAddCtrl';
	$scope.room = {
		name:'',
		description:'',
		private:false,
		password:'',
		confirmPassword:''
	}
	
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

	$scope.submit = function(){
		if($scope.room.password != $scope.room.confirmPassword){
			alert("两次输入的密码不一致");
			return false;
		}
		roomCreate.emit($scope.room);
		roomCreate.addListener(_name,function(data){
			$modalInstance.close('complate');
			$state.go('main.room',{roomId:data._id});	
			roomList.emit();
			$scope.room = {
				name:'',
				description:'',
				private:false,
				password:'',
				confirmPassword:''
			}
		});
	}
}]);

app.controller('roomCtrl',['$scope','$state','$stateParams','messageNew','messageList','roomInfo','userSelf','roomSubscribe','roomList','roomListByIds','roomUserList','roomJoin','roomLeave','permissionValid','$modal','activeNew','activeList','activeInfo',
	function($scope,$state,$stateParams,messageNew,messageList,roomInfo,userSelf,roomSubscribe,roomList,roomListByIds,roomUserList,roomJoin,roomLeave,permissionValid,$modal,activeNew,activeList,activeInfo){
		var _self             = userSelf.self();
		var _name             = 'roomCtrl';
		var roomId            = $stateParams.roomId;
		$scope.active         = 'actives';
		$scope.newActiveCount = 0;
		$scope.self           = _self;

		if(!_self){
			userSelf.emit();
		}
		// 从这里开始
		if(!roomInfo.info(roomId)){
			roomInfo.promise({_id:roomId})
				.then(function(room){	
					if(room.type == 2 || room.type == 4){
						permissionValid({roomId:room._id}).then(function(data){
							if(data.status == 0){
								init(room)
							}else{
								$state.go("valid",{id:roomId,name:room.name});
							}
						});
					}else{
						init(room);
					}
				});
		}else{
			init(roomInfo.info(roomId));
		}

		function init(room){
			if($.inArray(roomId,_self.rooms) == -1){
				var options = {_id:roomId};
				if(room.type == 2 || room.type == 4){
					options.hasPassword = true;
				}
				roomSubscribe.promise(options)
					.then(function(data){
						userSelf.emit();
						roomList.emit();
					});
			}
			$scope.room = room;
			if(!messageList.list(roomId))messageList.emit({_id:roomId});
			if(!roomUserList.list(roomId))roomUserList.emit({_id:roomId});

			// 动态处理
			if(activeList.getActives(roomId)){
				$scope.activeList = activeList.getActives(roomId);
			}else{
				activeList.emit({roomId:roomId});
			}
		}


		userSelf.addListener(_name,function(user){
			_self = user;
			$scope.self = user;
		});
		
		// online list
		// 这里每次进入房间需要重新绑定监听器 
		// 因为link 中的dom是新的 
		// 老的数据没有绑定到新的作用域上面来
		$scope.onlineList = roomUserList.list(roomId) ? roomUserList.list(roomId).users : [];
		$scope.onlineCount = $scope.onlineList ? $scope.onlineList.length : 0;
		roomUserList.addListener(_name,roomId,function(room){
			$scope.onlineList  = room.users;
			$scope.onlineCount = room.users.length;
		});

		messageList.addListener(_name,roomId,function(data){
			$scope.messageCount = data.length;
			$scope.messageList  = data;
		});
		// }
		

		// 同理对于新加入和离开房间事件也是
		roomJoin.addListener(_name,roomId,function(user){
			$scope.onlineList.unshift(user);
			$scope.onlineCount = $scope.onlineList.length;
		});

		roomLeave.addListener(_name,roomId,function(user){
			var _i = 0;
			angular.forEach($scope.onlineList,function(_user){
				if(_user._id == user._id){
					$scope.onlineList.splice(_i,1);	
				}else{
					_i++;
				}
			});
			$scope.onlineCount--;
		});

		// 动态事件绑定
		activeList.addListener(_name,function(data){
			if(data._id == roomId){
				$scope.activeList = data.actives;
			}
		});

		messageNew.setNewActiveListener(function(){
			$scope.newActiveCount++;
		});

		$scope.refreshActives = function(){
			$scope.newActiveCount = 0;
			activeList.emit({roomId:roomId});
		}


		$scope.send = function(){
			// 处理回车
			// $scope.text = $scope.text.replace(/\n/g,'<br>');
			// if($scope.text == ''){
			// 	alert('请输入内容');
			// }else{
			messageNew.emit({_id:roomId,content:$scope.text})
			$scope.text = '';	
			// }
		}

		$scope.sendComment = function(active,content){
			activeInfo.sendComment(active._id,content);
			active.comments.unshift({
				content:content,
				date:new Date(),
				sender: _self
			});
			active.comment = '';
		}

		$scope.getComment = function(active){
			activeInfo.getComment(active._id).then(function(messages){
				active.comments = messages;
			});
		}

		$scope.showNewActive = function(){
			var newActiveModal = $modal.open({
				animation:true,
				templateUrl:'/active/new.html',
				controller:'activeNewCtrl'
			});

			newActiveModal.result.then(function(result){
				var options = {
					_id:roomId,
					title:result.title,
					content:result.content
				}
				activeNew.emit(options);
			});
		}


		// message list controller
		var __name = 'roomMessageList';
		$scope.messageCount = 0;
		// messages
		if(messageList.checkListener(__name,roomId)){
			$scope.messageCount = messageList.list(roomId).length; 
			$scope.messageList = classHandle(messageList.list(roomId));
		}else{
			messageList.addListener(__name,roomId,function(list){
				$scope.messageCount = list.length;
				$scope.messageList = classHandle(list);
				// });
			});
		}
		$scope.messageList = classHandle($scope.messageList);

		// dom元素class处理
		function classHandle(list){
			angular.forEach(list,function(message,index){
				message.class = '';
				// 如果上条消息也是该用户发表的
				// 则显示为碎片模式
				var thisMsgDate = moment(list[index].date);
				var prevMsgDate = index > 1 ? moment(list[index-1].date) : 0;
				if(index > 0 && list[index].sender._id == list[index-1].sender._id && thisMsgDate.diff(prevMsgDate,'minutes') < 5){
					message.class += ' fragment';
				}

				// 我发的
				if(message.sender._id == _self._id){
					message.class += ' own';
				}
			});

			return list;
		}

		// 给滚动指令用的
		$scope.loadMore = function(){
			messageList.prev(roomId);
		}
	}]);

app.controller('roomValidDirectCtrl',['$scope','$state','$stateParams','$modal',
	function($scope,$state,$stateParams,$modal){
		var validModal = $modal.open({
			animation:true,
			templateUrl:'/room/valid.html',
			controller:'roomValidCtrl',
			resolve:{
				name:function(){
					return $stateParams.name;
				},
				_id:function(){
					return $stateParams.id;
				},
				action:function(){
					return '进入';
				}
			}
		});

		validModal.result.then(function(data){
			$state.go("main.room",{roomId:data._id});
		},function(result){
			$state.go("main");
		})
	}]);