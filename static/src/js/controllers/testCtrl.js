app.controller('testCtrl',
	['$scope','$q','roomList','roomJoin','roomLeave',
	function($scope,$q,roomList,roomJoin,roomLeave){
		var _name = 'testCtrl';
		$scope.title='哈哈哈';

		roomList.addListener('testCtrl',function(data){
			console.log('list from test1');
		})

		

		
	}]);

app.controller('test2Ctrl',
	['$scope','roomList',function($scope,roomList){
		roomList.addListener('test2Ctrl',function(data){
			console.log('list from test2');
		})
		$scope.testList = function(){
			roomList.emit();
		}

		roomList.on('test2onece',function(data){
			console.log('list once');
		});

		$scope.test2List = function(){
			roomList.emit();
		}
		
	}]);

app.controller('dialogTestCtrl',
	['$scope','messageList','messageNew','roomJoin','roomLeave','roomSubscribe',
	function($scope,messageList,messageNew,roomJoin,roomLeave,roomSubscribe){

		var _name = 'dialogTestCtrl';
		messageList.addListener(_name,function(data){

			console.log(data);
			$scope.messages = data;
		});

		roomJoin.addListener(_name,function(data){
			alert(data.nickname+' join room');
			console.log(data);
		})

		roomLeave.addListener(_name,function(data){
			console.log(data);
		})

		$scope.getRoomList = function(){
			roomList.emit();
		}

		$scope.joinRoom = function(){
			roomSubscribe.emit('55819ca049d4c3fe7afba875');
		}

		$scope.leaveRoom = function(){
			roomLeave('55819ca049d4c3fe7afba875',function(data){
				console.log(data);
			});
		}
		roomSubscribe.emit({_id:'55819ca049d4c3fe7afba875'});
		messageList.emit({_id:'55819ca049d4c3fe7afba875'});
	}]);