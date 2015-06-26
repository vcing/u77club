app.controller('testCtrl',
	['$scope','$q','roomList','roomJoin','roomLeave',
	function($scope,$q,roomList,roomJoin,roomLeave){
	$scope.title='哈哈哈';
	$scope.getRoomList = function(){
		roomList(function(data){
			console.log(data);
		});
	}

	$scope.joinRoom = function(){
		roomJoin('55819ca049d4c3fe7afba875',function(data){
			console.log(data);
		});
	}

	$scope.leaveRoom = function(){
		roomLeave('55819ca049d4c3fe7afba875',function(data){
			console.log(data);
		});
	}
}]);