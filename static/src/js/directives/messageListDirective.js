app.directive('messageList',function(){
	return {
		restrict:'A',
		templateUrl:'/message/list.html',
		scope:{
			messageList:'=',
			messageCount:'='
		},
		controller:'messageListCtrl',
		link:function($scope,element,attrs){
			$scope.$watch('messageCount',function(n,o){
				var _height = 0;
				var _outHeight = $(element).height();
				var isFrist = true;
				angular.forEach($(element).find('.message'),function(dom){
					_height += $(dom).height() + 15;
				});
				
				if(isFrist){
					$(element).animate({scrollTop: _height},200);
					isFrist = false;
				}

				if(_height > _outHeight && $(element).scrollTop() + $(element).height() + 100 >= _height ){
					$(element).animate({scrollTop: _height+'px'},200);
				}
			})
		}	
	}
});