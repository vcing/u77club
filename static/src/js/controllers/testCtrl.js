// app.controller('dialogTestCtrl',
// 	['$scope','messageList','messageNew','roomJoin','roomLeave','roomSubscribe','userSelf','roomUserList','roomList',
// 	function($scope,messageList,messageNew,roomJoin,roomLeave,roomSubscribe,userSelf,roomUserList,roomList){

// 		var _name = 'dialogTestCtrl';
// 		messageList.addListener(_name,'55819ca049d4c3fe7afba875',function(data){
// 			$scope.messages = data;
// 			console.log(data);
// 		});

// 		$scope.sendMessage = function(){
// 			messageNew.emit({_id:'55819ca049d4c3fe7afba875',content:$scope.content});			
// 		}
		
// 		roomJoin.addListener(_name,'55819ca049d4c3fe7afba875',function(data){
// 			console.log(data);
// 		});

// 		roomLeave.addListener(_name,'55819ca049d4c3fe7afba875',function(data){
// 			console.log(data);
// 		});

// 		userSelf.addListener(_name,function(data){
// 			console.log(data);
// 		});

// 		roomUserList.addListener(_name,function(data){
// 			console.log(data);
// 		});

// 		$scope.getRoomList = function(){
// 			roomList.emit();
// 		}

// 		$scope.getRoomList2 = function(){
// 			console.log(roomList.list());
// 		}

// 		$scope.joinRoom = function(){
// 			roomSubscribe.emit({_id:'55819ca049d4c3fe7afba875'});
// 		}

// 		$scope.leaveRoom = function(){
// 			roomLeave.emit({_id:'55819ca049d4c3fe7afba875'});
// 		}

// 		$scope.getSelf = function(){
// 			userSelf.emit();
// 		}

// 		$scope.roomUserList = function(){
// 			roomUserList.emit();
// 		}
// 		// roomSubscribe.emit({_id:'55819ca049d4c3fe7afba875'});
// 		messageList.emit({_id:'55819ca049d4c3fe7afba875'});
// 	}]);

// app.run(['$rootScope','$state','$stateParams',function($rootScope,$state,$stateParams){
// 	$rootScope.$state = $state;
// 	$rootScope.$stateParams = $stateParams;
// }]);

// app.config(['$stateProvider',function($stateProvider){
// 	$stateProvider
// 		.state('one',{
// 			url: "/one/:id",
// 			template:'<h1 ng-bind="title">This is one</h1><div ui-view></div>',
// 			controller:'viewOne'
// 		})
// 		.state('one.two',{
// 			url: "/two",
// 			template:'<h1>This is two</h1>'
// 		})
// 		.state('one.three',{
// 			url: "/three",
// 			template:'<h1>This is three</h1>'
// 		})
// 		.state('four',{
// 			url: "/four",
// 			template:'<h1>This is four</h1><div ui-view></div>'
// 		})
// 		.state('four.five',{
// 			url: "/five",
// 			template:'<h1>This is five</h1>'
// 		});
// 		// .state('',{
// 		// 	url:'/',
// 		// 	template:'<h1>default</h1>'
// 		// });
// }]);

// app.controller('viewOne',['$scope','$stateParams',function($scope,$stateParams){
// 				$scope.title = 'id:'+$stateParams.id;
// 			}]);

// app.controller('routerTest',['$scope',function($scope){
// 	$scope.navs = [
// 		{
// 			state:'one({id:2})',
// 			title:'one'
// 		},
// 		{
// 			state:'one.two',
// 			title:'two'
// 		},
// 		{
// 			state:'one.three',
// 			title:'three'
// 		},
// 		{
// 			state:'four',
// 			title:'four'
// 		},
// 		{
// 			state:'four.five',
// 			title:'five'
// 		}
// 	]
// }]);