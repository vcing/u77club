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
						controller:'indexCtrl',
					}
				}
			})
			.state('main.rooms',{
				url:'room',
				views:{
					'content':{
						templateUrl:'room/main.html',
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
			.state('main.active',{
				url:'active/:activeId',
				views:{
					'content':{
						templateUrl:'active/info.html',
						controller:'activeInfoCtrl'
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
			.state('main.setting',{
				url:'setting',
				views:{
					'content':{
						templateUrl:'setting.html',
						controller:'settingCtrl'
					}
				}
			})
			.state('main.favorite',{
				url:'favorite',
				views:{
					'content':{
						templateUrl:'favorite.html',
						controller:'favoriteCtrl'
					}
				}
			})
			.state('main.discover',{
				url:'discover',
				views:{
					'content':{
						templateUrl:'discover.html',
						controller:'discoverCtrl'
					}
				}
			})
			.state('main.profile',{
				url:'profile',
				views:{
					'content':{
						templateUrl:'profile.html',
						controller:'profileCtrl'
					}
				}
			})
			
		$urlRouterProvider.when("", "/");
		$urlRouterProvider.otherwise('/');

		// 时间本地化
		moment.locale('zh-cn');
	}]);


app.run(['socket','userSelf','$rootScope','$urlRouter','$state','$stateParams','roomInfo','messagePrivate','$location','$anchorScroll',
	function(socket,userSelf,$rootScope,$urlRouter,$state,$stateParams,roomInfo,messagePrivate,$location,$anchorScroll){
		// 根作用于绑定 路由状态
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		$rootScope.userSelf = userSelf.self();
		if(!$rootScope.userSelf){
			userSelf.promise().then(function(self){
				$rootScope.self = self;
			});
		}
		
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

		// 绑定锚点跳转函数
		$rootScope.scrollTo = function(hash){
			$location.hash(hash);
			$anchorScroll();
		}
	}]);