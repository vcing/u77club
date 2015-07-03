app.directive('sideBar',function(){
	return {
		restrict:'AE',
		templateUrl:'sideBar.html',
		scope:{},
		controller:'sideBarCtrl',
		link:function($scope,element,attrs){
			$(element).find('.toggle').on('click',function(){
				$(element).find('.menu').toggle();
			});
			$('#sidebar .tabs-wrap').on('click',function(){
				$(element).find('.menu').hide();
			})
			$('#u77club .main').on('click',function(){
				$(element).find('.menu').hide();
			})
		}
	};
});