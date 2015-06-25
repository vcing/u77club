app.controller('roomCtrl',['$scope','$q','roomList','roomJoin',function($scope,$q,roomList,roomJoin){
	$scope.title='哈哈哈';
	$scope.getRoomList = function(){
		roomList().then(function(data){
			console.log(data);
		});
	}

	$scope.joinRoom = function(){
		roomJoin('55819ca049d4c3fe7afba875').then(function(data){
			console.log(data);
		});
	}
}]);