app.directive('inputArea',function(){
	return {
		restrict:'AE',
		templateUrl:'/room/inputArea.html',
		// scope:{
		// 	atList:'=',
		// 	onlineList:'='
		// },
		replace:true,
		link:function($scope,element,attrs){
			$scope.$watch('onlineList',function(n,o){				
				$(element).find('textarea').atwho({
					at: "@",
					data: $scope.onlineList,
					displayTpl:'<li>${nickname}</li>'
				});		
			},true);
		}
	};
});