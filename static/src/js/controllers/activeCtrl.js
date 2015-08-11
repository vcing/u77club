app.controller('activeNewCtrl',['$scope','$modalInstance',
	function($scope,$modalInstance){
		$scope.content = '';

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.submit = function(){
			if($scope.content != '')$modalInstance.close({title:$scope.title,content:$scope.content});
		}
	}]);

app.controller('activeListCtrl',['$scope',
	function($scope){

	}]);

app.controller('activeInfoCtrl',['$scope','activeInfo','$state','$stateParams','userSelf',
	function($scope,activeInfo,$state,$stateParams,userSelf){
		var _id = $stateParams.activeId;
		activeInfo.promise(_id).then(function(data){
			$scope.active = data;

			activeInfo.getComment($scope.active._id).then(function(messages){
				$scope.active.comments = messages;
				$scope.active.showComment = true;
			});
		});

		
	}]);

app.controller('activeSingleCtrl',['$scope','activeInfo','userSelf',
	function($scope,activeInfo,userSelf){
		$scope.sendComment = function(active,content){
			activeInfo.sendComment(active._id,content);
			active.comments.unshift({
				content:content,
				date:new Date(),
				sender: userSelf.self()
			});
			active.comment = '';
		}
	}])