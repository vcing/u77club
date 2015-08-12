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
		var _self = userSelf.self();

		if(_.indexOf(_self.support,$scope.active._id) != -1){
			$scope.active.isSupport = true;
		}

		if(_.indexOf(_self.favorite,$scope.active._id) != -1){
			$scope.active.isFavorite = true;
		}


		userSelf.addListener('activeSingleCtrl',function(user){
			_self = user;
		})


		$scope.sendComment = function(content){
			activeInfo.sendComment($scope.active._id,content);
			if(!$scope.active.comments)$scope.active.comments = [];
			$scope.active.comments.unshift({
				content:content,
				date:new Date(),
				sender: userSelf.self()
			});
			$scope.active.comment = '';
		}


		$scope.getComment = function(){
			activeInfo.getComment($scope.active._id).then(function(messages){
				$scope.active.comments = messages;
			});
		}


		$scope.support = function(){
			activeInfo.support($scope.active._id);
			$scope.active.support++;
			$scope.active.isSupport = true;
			_self.support.push($scope.active._id);
			userSelf.setSelf(_self);
		}

		$scope.favorite = function(){
			activeInfo.favorite($scope.active._id);
			$scope.active.isFavorite = true;
			_self.favorite.push($scope.active._id);
			userSelf.setSelf(_self);
		}
	}])