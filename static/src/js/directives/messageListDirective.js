// messageListScorllHandle
app.directive('mlsh',function(){
	return function($scope,element,attrs){
		var isFirst = 0;
		var anchor;
		$scope.$watch('messageCount',function(n,o){
			// 判断是否加载更多 加载完毕
			if(n - o > 1 && o > 0 && isFirst > 1){	
				$scope.scrollTo(anchor);
			}

			if(isFirst < 2){
				$(element).animate({scrollTop:9999},200);
				isFirst++;
			}



			var _height = 0;
			var _outHeight = $(element).height();

			angular.forEach($(element).find('.message'),function(dom){
				_height += dom.clientHeight
			});	
			_height -= $(element).find('.message.fragment').length * 3.5;

			if(_height > _outHeight && $(element).scrollTop() + $(element).height() + 100 >= _height ){
				var scrollToBottom = function(){
					$(element).animate({scrollTop: _height+'px'},200);	
				}
				setTimeout(scrollToBottom,200);
				
			}
		});

		$(element).scroll(function(e){
			if($(element).scrollTop() <= 0 && isFirst >= 1){
				anchor = 'm_'+$scope.messageList[0]._id;
				$scope.loadMore();
			}
		});
	}
});