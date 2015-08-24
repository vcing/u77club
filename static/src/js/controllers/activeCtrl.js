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

app.controller('activeSingleCtrl',['$scope','activeInfo','userSelf','$modal','userInfo',
	function($scope,activeInfo,userSelf,$modal,userInfo){
		var _self = userSelf.self();
		if(_self){
			init();
		}else{
			userSelf.promise().then(function(self){
				_self = self;
				init();
			});
		}



		/**
		 * 取消了作者传入
		 * 统一重新从服务器获取
		 * 获取时 设置了客户端缓存
		 */
		function init(){
			$scope.$watch('active',function(n,o,$scope){
				if($scope.active){
					// 加载作者
					if(!$scope.active.sender._id){
						userInfo.promise($scope.active.sender).then(function(user){
							$scope.sender = user;
						});
					}else{
						$scope.sender = $scope.active.sender;
					}

					if(_.indexOf(_self.support,$scope.active._id) != -1){
						$scope.active.isSupport = true;
					}

					// 判断是否已经点赞
					if(_.indexOf(_self.favorite,$scope.active._id) != -1){
						$scope.active.isFavorite = true;
					}

					// 加载原动态
					if($scope.active.original){
						activeInfo.promise($scope.active.original).then(function(original){
							$scope.active.original = original;
							// 判断是否已经对原动态点赞
							if(_.indexOf(_self.support,$scope.active.original._id) != -1){
								$scope.active.original.isSupport = true;
							}
						});
					}
				}
			});
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
			$scope.active.commentCount++;
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

		$scope.o_support = function(){
			activeInfo.support($scope.active.original._id);
			$scope.active.original.support++;
			$scope.active.original.isSupport = true;
			_self.support.push($scope.active.original._id);
			userSelf.setSelf(_self);
		}

		$scope.favorite = function(){
			activeInfo.favorite($scope.active._id);
			$scope.active.isFavorite = true;
			_self.favorite.push($scope.active._id);
			userSelf.setSelf(_self);
		}

		$scope.repost = function(){
			var repostModal = $modal.open({
				animation:true,
				templateUrl:'/active/repost.html',
				controller:'activeRepostCtrl',
				resolve:{
					active:function(){
						return $scope.active;
					}
				}
			});
		}

		$scope.o_repost = function(){
			var repostModal = $modal.open({
				animation:true,
				templateUrl:'/active/repost.html',
				controller:'activeRepostCtrl',
				resolve:{
					active:function(){
						return $scope.active.original;
					}
				}
			});
		}
	}])

app.controller('activeRepostCtrl',['$scope','$modalInstance','active','roomListByIds','activeInfo',
	function($scope,$modalInstance,active,roomListByIds,activeInfo){
		$scope.list = roomListByIds.list();
		$scope.active = active;
		$scope.dest = {
			name:'请选择房间'
		}

		if($scope.active.original){
			$scope.content = '//@'+$scope.active.sender.nickname+':'+$scope.active.content;
		}

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.submit = function(){
			
			var options = {
				dest: $scope.dest,
				original: $scope.active,
				content: $scope.content,
				src: $scope.active
			}

			if($scope.active.original){
				options.original = $scope.active.original;
			}
			
			$scope.active.repostCount++;
			activeInfo.repost(options);
			$modalInstance.close();
		}

		$scope.chose = function(dest){
			$scope.dest = dest;
		}
	}]);