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
	console.log('loading room list');
}])

app.controller('roomCtrl',['$scope','$stateParams','messageNew','messageList',function($scope,$stateParams,messageNew,messageList){
	var _name = 'roomCtrl';
	var roomId = $stateParams.roomId;
	if(messageList.checkListener(_name,roomId)){
		$scope.messageList = $messageList(roomId);
	}else{
		messageList.addListener(_name,roomId,function(data){
			$scope.messageList = data;
		});
		messageList.emit({_id:roomId});
	}

	$scope.send = function(){
		messageNew.emit({_id:roomId,content:$scope.text})
	}
}]); 