app.directive('sideBar',function(){
	return {
		restrict:'AE',
		templateUrl:'sideBar.html',
		controller:'sideBarCtrl',
		// link:function($scope,element,attrs){
		// 	$(element).find('.toggle').on('click',function(){
		// 		$(element).find('.menu').toggle();
		// 	});
		// 	$('#sidebar .tabs-wrap').on('click',function(){
		// 		$(element).find('.menu').hide();
		// 	})
		// 	$('#u77club .main').on('click',function(){
		// 		$(element).find('.menu').hide();
		// 	})
		// }
	};
});

app.directive('sidebarHandle',function(){
	return function($scope,element,attrs){
		fit();
		$(window).on('resize',function(){
			fit();
		});

		function fit(){
			$(element).find('.group').css('width',$(element).width());
		}

		$scope.$watch('roomSidebarToggle',function(n,o){
			fit();
		});

		$scope.$watch('active',function(n,o){
			fit();
			
			var _i = 0;
			switch($scope.active){
				case 'actives':_i = 0;break;
				case 'users':_i = 1;break;
			}
			$(element).find('.wraper').css('left',-1*_i*$(element).width());
		});
	}
})