app.controller('roomListCtrl',['$scope','$stateParams','roomList',function($scope,$stateParams,roomList){
	var _name = 'roomlistCtrl';
	if(roomList.checkListener(_name)){
		$scope.roomList = roomList.list();
	}else{
		roomList.addListener(_name,function(data){
			$scope.roomList = data;
		});
		roomList.emit();
	}
	$scope.showCreateRoom = function(){
		$('#create-room').modal('show');
	}
}]);

app.controller('roomAddCtrl',['$scope','roomCreate','roomList','$state',function($scope,roomCreate,roomList,$state){
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

app.controller('roomCtrl',['$scope','$stateParams','messageNew','messageList','roomInfo',function($scope,$stateParams,messageNew,messageList,roomInfo){
	var _name = 'roomCtrl';
	var roomId = $stateParams.roomId;
	roomInfo.addListener(_name,roomId,function(room){
		$scope.room = room;
	});
	roomInfo.emit({_id:roomId});

	if(messageList.checkListener(_name,roomId)){
		$scope.messageList = messageList.list(roomId);
	}else{
		messageList.addListener(_name,roomId,function(data){
			$scope.messageList = data;
		});
		messageList.emit({_id:roomId});
	}

	$scope.send = function(){
		messageNew.emit({_id:roomId,content:$scope.text})
		$scope.text = '';
	}
}]); 