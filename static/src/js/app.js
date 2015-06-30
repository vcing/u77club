var app = angular.module('u77club',['btford.socket-io','ui.router']);

app.service('socket',['socketFactory',function(socketFactory){
	var socket = socketFactory();
	socket.on('system:nologin',function(){
		window.location.href='/login.html';
	});
	return socket;
}]);


app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("", "/");
	$urlRouterProvider.otherwise('/');
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
		// .state('main.createroom',{
		// 	url:'createroom',
		// 	views:{
		// 		'dialog':{
		// 			templateUrl:'room/create.html',
		// 			controller:'roomAddCtrl'
		// 		}
		// 	}
		// })

}]);
