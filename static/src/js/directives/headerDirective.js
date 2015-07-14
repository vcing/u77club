app.directive('header',function(){
	return {
		restrict:'AE',
		templateUrl:'/header.html',
		scope:{},
		// link:function($scope,element,attrs){
		// 	$('body').on('click','#u77club.sidebar-open .main',function(){
		// 		$('#u77club').removeClass('sidebar-open');
		// 	});
		// 	$(element).find('.menu-toggle').on('click',function(){
		// 		if($('#u77club').hasClass('sidebar-open')){
		// 			$('#u77club').removeClass('sidebar-open');
		// 		}else{
		// 			$('#u77club').addClass('sidebar-open');
		// 		}
		// 	});
			
		// }
	};
});