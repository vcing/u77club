app.controller('roomListCtrl',['$scope','$stateParams','roomList','roomListByIds','userSelf','roomSubscribe',
	function($scope,$stateParams,roomList,roomListByIds,userSelf,roomSubscribe){
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

	$scope.toggleSubscript = function(_id){
		roomSubscribe.on(_name,function(data){
			userSelf.emit();
		});
		userSelf.on(_name,function(data){
			roomList.emit();
			roomListByIds.emit({_ids:data.rooms});
		});
		roomSubscribe.emit({_id:_id});
	}

	$scope.showCreateRoom = function(){
		$('#create-room').modal('show');
	}
}]);

app.controller('roomAddCtrl',['$scope','roomCreate','roomList','$state',
	function($scope,roomCreate,roomList,$state){
	var _name = 'roomAddCtrl';
	$scope.room = {
		name:'',
		description:'',
		private:false,
		password:'',
		confirmPassword:''
	}

	$scope.submit = function(){
		if($scope.room.password != $scope.room.confirmPassword){
			alert("两次输入的密码不一致");
			return false;
		}
		roomCreate.emit($scope.room);
		roomCreate.addListener(_name,function(data){
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

app.controller('roomCtrl',['$scope','$stateParams','messageNew','messageList','roomInfo','userSelf','roomSubscribe','roomList','roomListByIds','roomUserList','roomJoin','roomLeave',
	function($scope,$stateParams,messageNew,messageList,roomInfo,userSelf,roomSubscribe,roomList,roomListByIds,roomUserList,roomJoin,roomLeave){
		var _self = userSelf.self();
		var _name = 'roomCtrl';
		var roomId = $stateParams.roomId;

		if(!_self){
			userSelf.emit();
		}
		
		// online list
		// 这里每次进入房间需要重新绑定监听器 
		// 因为link 中的dom是新的 
		// 老的数据没有绑定到新的作用于上面来
		// if(!roomUserList.checkListener(_name,roomId)){
		$scope.onlineList = [];
		roomUserList.addListener(_name,roomId,function(room){
			$scope.onlineList = room.users;
		});
		// }
		roomUserList.emit({_id:roomId});

		// 同理对于新加入和离开房间事件也是
		roomJoin.addListener(_name,roomId,function(user){
			$scope.onlineList.unshift(user);
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
		});
		
		// join room
		if(_self && $.inArray(roomId,_self.rooms) == -1){
			roomSubscribe.emit({_id:roomId});
			_self.rooms.unshift(roomId);
			userSelf.setSelf(_self);
			roomList.emit();
			roomListByIds.emit({_ids:_self.rooms});
		}

		// room info
		roomInfo.addListener(_name,roomId,function(room){
			$scope.room = room;
		});
		roomInfo.emit({_id:roomId});

		

		$scope.send = function(){
			messageNew.emit({_id:roomId,content:$scope.text})
			$scope.text = '';
		}
	}]); 