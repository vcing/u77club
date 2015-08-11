app.directive('activeList',function(){
	return {
		restrict:'AE',
		templateUrl:'/active/list.html',
		controller:'activeListCtrl',
		link:function($scope,element,attrs){

		}
	};
});

app.directive('singleActive',function(){
	return {
		restrict:'A',
		templateUrl:'/active/single.html',
		controller:'activeSingleCtrl',
		scope:{
			active:'=singleActive',
			sender:'=sender'
		},
		link:function($scope,element,attrs){

		}
	};
});