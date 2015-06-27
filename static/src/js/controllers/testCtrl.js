app.controller('dialogTestCtrl',
	['$scope','messageList','messageNew','roomJoin','roomLeave','roomSubscribe','userSelf','roomUserList','roomList',
	function($scope,messageList,messageNew,roomJoin,roomLeave,roomSubscribe,userSelf,roomUserList,roomList){

		var _name = 'dialogTestCtrl';
		messageList.addListener(_name,function(data){

			console.log(data);
			$scope.messages = data;
		});

		roomJoin.addListener(_name,function(data){
			// alert(data.nickname+' join room');
			console.log(data);
		});

		roomLeave.addListener(_name,function(data){
			console.log(data);
		});

		userSelf.addListener(_name,function(data){
			console.log(data);
		});

		roomUserList.addListener(_name,function(data){
			console.log(data);
		});

		$scope.getRoomList = function(){
			roomList.emit();
		}

		$scope.getRoomList2 = function(){
			console.log(roomList.list());
		}

		$scope.joinRoom = function(){
			roomSubscribe.emit({_id:'55819ca049d4c3fe7afba875'});
		}

		$scope.leaveRoom = function(){
			roomLeave.emit({_id:'55819ca049d4c3fe7afba875'});
		}

		$scope.getSelf = function(){
			userSelf.emit();
		}

		$scope.roomUserList = function(){
			roomUserList.emit();
		}
		// roomSubscribe.emit({_id:'55819ca049d4c3fe7afba875'});
		messageList.emit({_id:'55819ca049d4c3fe7afba875'});
	}]);