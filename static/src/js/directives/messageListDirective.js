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
			$(element).animate({scrollTop: 9999},200);
			$scope.$watch('messageCount',function(n,o){
				var _height = 0;
				var _outHeight = $(element).height();
				angular.forEach($(element).find('.message'),function(dom){
					_height += $(dom).height() + 15;
				});
				_height -= $(element).find('.message.fragment').length * 3.5;

				_height - $(element).find('.message.fragment').length * 3.5
				if(_height > _outHeight && $(element).scrollTop() + $(element).height() + 100 >= _height ){
					$(element).animate({scrollTop: _height+'px'},200);
				}
			})
		}	
	}
});


// messageListScorllHandle
// for private message
app.directive('mlsh',function(){
	return function($scope,element,attrs){
		$(element).animate({scrollTop:9999},200);
		$scope.$watch('messageCount',function(n,o){

			var _height = 0;
			var _outHeight = $(element).height();

			angular.forEach($(element).find('.message'),function(dom){
				_height += dom.clientHeight
			});	
			_height -= $(element).find('.message.fragment').length * 3.5;

			if(_height > _outHeight && $(element).scrollTop() + $(element).height() + 100 >= _height ){
				$(element).animate({scrollTop: _height+'px'},200);
			}
		});
		
	}
});