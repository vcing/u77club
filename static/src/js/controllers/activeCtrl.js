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