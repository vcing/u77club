var app = angular.module('u77club',['btford.socket-io']);

app.service('socket',['socketFactory',function(socketFactory){
	return socketFactory();
}]);