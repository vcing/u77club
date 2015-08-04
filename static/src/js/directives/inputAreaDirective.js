app.directive('atwho',function(){
	return function($scope,element,attrs){
		$scope.$watch('onlineList',function(n,o){
			$(element).atwho({
				at: "@",
				data: $scope.onlineList,
				displayTpl:'<li>${nickname}</li>',
				insertTpl:' @${nickname} '
			});		
		},true);
	}
});