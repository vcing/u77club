app.controller('activeNewCtrl',['$scope','$modalInstance',
	function($scope,$modalInstance){
		$scope.content = '';

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.submit = function(){
			if($scope.content != '')$modalInstance.close($scope.content);
		}
	}]);

app.controller('activeListCtrl',['$scope',
	function($scope){

	}]);

app.controller('activeInfoCtrl',['$scope','activeInfo','$state','$stateParams',
	function($scope,activeInfo,$state,$stateParams){
		var _id = $stateParams.activeId;
		activeInfo.promise(_id).then(function(data){
			console.log(data);
			$scope.active = data;
		});
	}]);