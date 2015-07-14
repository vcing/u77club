var app = angular.module('u77club',['btford.socket-io','ui.router','ui.bootstrap']);

app.service('socket',['socketFactory',function(socketFactory){
	var socket = socketFactory();
	socket.on('system:nologin',function(){
		window.location.href='/login.html';
	});
	return socket;
}]);


app.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){

		

		// 路由
		
		$stateProvider
			.state('main',{
				url:'/',
				views:{
					'main':{
						templateUrl:'main.html',
						controller:'roomListCtrl',
					}
				}
			})
			.state('main.room',{
				url:'room/:roomId',
				views:{
					'content':{
						templateUrl:'room/room.html',
						controller:'roomCtrl',
					}
				}
			})
			.state('valid',{
				url:'/valid/:id/:name',
				views:{
					'main':{
						template:'room/validDirect.thml',
						controller:'roomValidDirectCtrl',
					}
				}
			})
		$urlRouterProvider.when("", "/");
		$urlRouterProvider.otherwise('/');
	}]);


app.run(['socket','userSelf','$rootScope','$urlRouter','$state','$stateParams','roomInfo',
	function(socket,userSelf,$rootScope,$urlRouter,$state,$stateParams,roomInfo){
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.$on('$locationChangeSuccess',function(evt){
			if(!$stateParams.roomId)roomInfo.info('list');
			evt.preventDefault();
			$urlRouter.sync();
		});

		socket.addListener('user:online',function(user){
			userSelf.setSelf(user,true);
		});

		// 初始化侧栏
		$rootScope.sideBarToggle = false;
	}]);