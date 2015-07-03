app.directive('createRoom',function(){
	return {
		restrict:'AE',
		templateUrl:'/room/create.html',
		scope:{},
		controller:'roomAddCtrl',
		link:function($scope,element,attrs){
			$(element).find('#create-room .submit').on('click',function(){
				$(element).find('#create-room').modal('hide');
			});
		}
	};
});