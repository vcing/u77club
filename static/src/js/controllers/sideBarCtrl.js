app.controller('sideBarCtrl',['$scope','$stateParams','userSelf','roomListByIds',
	function($scope,$stateParams,userSelf,roomListByIds){
		var _name = 'sideBarCtrl';
		var _user = userSelf.self();
		$scope.user = _user;
		userSelf.addListener(_name,function(user){
			_user = user;
			$scope.user = user;
			roomListByIds.emit({_ids:user.rooms});
		});
		
		if(!roomListByIds.checkListener(_name)){
			roomListByIds.addListener(_name,function(rooms){
				$scope.rooms = rooms;
			});
		}
		if(_user){
			userSelf.emit();
			// roomListByIds.emit({_ids:_user.rooms});
		}
		
	}]); 