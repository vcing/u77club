app.directive('inputArea',function(){
	return {
		restrict:'AE',
		templateUrl:'/room/inputArea.html',
		scope:{
			atList:'=',
			userList:'='
		}
		replace:true,
		link:function($scope,element,attrs){
			$(element).find('textarea').atwho({
				at: "@",
				data: $scope.atList,
			}).atwho({
				at: ":",
				data: ["+1", "-1", "smile"]
			});
			$(element).find('textarea').on('matched.atwho',function(event,flag,query){
				console.log($scope.atList);
			});
		}
	};
});