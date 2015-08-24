app.controller('favoriteCtrl',['$scope','activeList',
	function($scope,activeList){
		activeList.favoritePromise().then(function(userInfo){
			$scope.favorite = userInfo.favorite;
			$scope.support = userInfo.support;

			$scope.active = 'favorite';
		});
	}]);