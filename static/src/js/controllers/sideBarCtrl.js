app.controller('sideBarCtrl',['$scope','$stateParams','userSelf','roomListByIds','messageNew','roomInfo','roomUpdateActive','messagePrivate',
	function($scope,$stateParams,userSelf,roomListByIds,messageNew,roomInfo,roomUpdateActive,messagePrivate){
		var _name = 'sideBarCtrl';
		var _user = userSelf.self();
		// 当前激活房间ID
		$scope.currentRoomId = $stateParams.roomId;
		$scope.user = _user;
		$scope.count = messagePrivate.count();

		
		userSelf.addListener(_name,function(user){
			_user = user;
			$scope.user = user;
		});


		// 给roominfo设置侧栏监听器 如果触发则更新侧栏信息
		roomInfo.setSideBarAction(function(_id){
			$scope.currentRoomId = _id;
			angular.forEach($scope.rooms,function(room){
				if(room._id == _id){
					room.messageRemind = 0;
				}
			});
		});
		
		if(!roomListByIds.checkListener(_name)){
			roomListByIds.addListener(_name,function(rooms){
				$scope.rooms = rooms;
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
			});
		}
		if(_user){
			userSelf.emit();
		}

		// 初始化侧栏菜单
		$scope.tab = 'menu';
		
	}]); 