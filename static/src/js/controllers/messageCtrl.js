app.controller('messageListCtrl',['$scope','messageList','$stateParams',
	function($scope,messageList,$stateParams){
		var _name = 'messageListCtrl';
		var roomId = $stateParams.roomId;
		$scope.messageCount = 0;
		// messages
		if(messageList.checkListener(_name,roomId)){
			// $scope.$apply(function(){
			$scope.messageCount = messageList.list(roomId).length; 
			$scope.messageList = messageList.list(roomId);
			// });
		}else{
			messageList.addListener(_name,roomId,function(data){
				// $scope.$apply(function(){
				$scope.messageCount = data.length;
				$scope.messageList = data;
				// });
			});
			messageList.emit({_id:roomId});
		}
	}]);