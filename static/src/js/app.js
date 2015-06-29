var app = angular.module('u77club',['btford.socket-io','ui.router','ui.bootstrap']);

app.service('socket',['socketFactory',function(socketFactory){
	return socketFactory();
}]);


app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("", "/");
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('main',{
			url: "/",
			views:{
				'main@':{
					templateUrl:'main.html',
					controller:'roomListCtrl',
				}
			}
		})
		.state('room',{
			url:'/room/:roomId',
			// templateUrl:'room/room.html',
			views:{
				'main@':{
					templateUrl:'main.html',
				},
				'content@room':{
					templateUrl:'room/room.html',
					controller:'roomCtrl',
				}
			}
		})

}]);
