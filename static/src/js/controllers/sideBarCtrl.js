app.controller('sideBarCtrl',['$scope','$stateParams',function($scope,$stateParams){
	if($stateParams.roomId){
		console.log('now in room:'+$stateParams.roomId);
	}else{
		console.log('loading side bar');	
	}
	
}]); 