app.controller('sideBarCtrl',['$scope','$stateParams','userSelf','roomListByIds','messageNew','roomInfo','roomUpdateActive','messagePrivate',
	function($scope,$stateParams,userSelf,roomListByIds,messageNew,roomInfo,roomUpdateActive,messagePrivate){
		var _name = 'sideBarCtrl';


		userSelf.promise().then(function(user){
			$scope.user = user;	
			_user = user;
			userSelf.addListener(_name,function(user){
				_user = user;
				$scope.user = user;
			});
		});

		// 获取私聊记录
		// promise防止记录为空
		var _record = messagePrivate.record();
		if(_record.then){
			_record.then(function(record){
				$scope.record = record;
				setUnreadMessageCount(record);
			});
		}else{
			$scope.record = _record;
			setUnreadMessageCount(_record);
		}

		function setUnreadMessageCount(record){
			var _count = 0;
			angular.forEach(record,function(data,index){
				_count += data.count;
				if(_count > 99){
					_count = '99+';
					$scope.messageCount = _count;
					return;
				}
			});
			$scope.messageCount = _count;
		}

		function setRoomUnreadMessageCount(rooms){
			var _count = 0;
			angular.forEach(rooms,function(room){
				_count += room.messageRemind;
				if(_count > 99){
					_count = '99+';
					$scope.messageCount = _count;
					return;
				}
			});
			$scope.roomUnreadMessage = _count;
		}

		// 当前激活房间ID
		$scope.currentRoomId      = $stateParams.roomId;
		$scope.active             = 'room';
		$scope.openPrivateMessage = messagePrivate.openPrivateMessage;
		messagePrivate.addListener(_name,function(){
			$scope.record = messagePrivate.record();
			setUnreadMessageCount($scope.record);
		})
		
		
		messagePrivate.setSideBarAction(setUnreadMessageCount);

		// 给roominfo设置侧栏监听器 如果触发则更新侧栏信息
		roomInfo.setSideBarAction(function(_id){
			$scope.currentRoomId = _id;
			angular.forEach($scope.rooms,function(room){
				if(room._id == _id){
					room.messageRemind = 0;
				}
			});
			setRoomUnreadMessageCount($scope.rooms);
		});
		
		if(!roomListByIds.checkListener(_name)){
			roomListByIds.addListener(_name,function(rooms){
				$scope.rooms = rooms;
				setRoomUnreadMessageCount(rooms);
			});
		}

		if(!messageNew.checkListener(_name)){
			messageNew.addListener(_name,function(msg){
				angular.forEach($scope.rooms,function(room){
					// 如果新消息非当前激活房间消息 则侧栏消息提醒 计数+1
					if(room._id == msg.room && $scope.currentRoomId != room._id){
						if(room.messageRemind){
							room.messageRemind++;
						}else{
							room.messageRemind = 1;
						}
						
					}
					// 如果接受到的消息是当前激活房间的消息 则更新用户房间最后一次活动时间
					if(room._id == msg.room && $scope.currentRoomId == room._id){
						roomUpdateActive.emit({_id:room._id});
					}
				});
				setRoomUnreadMessageCount($scope.rooms);
			});
		}

		// 初始化侧栏菜单
		$scope.tab = 'menu';
		
	}]); 