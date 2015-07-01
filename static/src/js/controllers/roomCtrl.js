app.controller('roomListCtrl',['$scope','$stateParams','roomList','userSelf','socket','roomSubscribe',
	function($scope,$stateParams,roomList,userSelf,socket,roomSubscribe){
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
			socket.emit('user:self');
		});
		userSelf.on(_name,function(data){
			socket.emit('room:list',{});	
		});
		socket.emit('room:subscribe',{_id:_id});
		return true;
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
		
		// console.log($scope.room);

	}
}]);

app.controller('roomCtrl',['$scope','$stateParams','messageNew','messageList','roomInfo','userSelf','roomSubscribe','roomList',
	function($scope,$stateParams,messageNew,messageList,roomInfo,userSelf,roomSubscribe,roomList){
		var _self = userSelf.self();
		var _name = 'roomCtrl';
		var roomId = $stateParams.roomId;
		// join room
		if($.inArray(roomId,_self.rooms) == -1){
			roomSubscribe.emit({_id:roomId});
			_self.rooms.unshift(roomId);
			userSelf.setSelf(_self);
			roomList.emit();
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