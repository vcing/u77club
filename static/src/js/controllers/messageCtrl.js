app.controller('messageListCtrl',['$scope','messageList','$stateParams','userSelf',
	function($scope,messageList,$stateParams,userSelf){
		var _name = 'messageListCtrl';
		var roomId = $stateParams.roomId;
		var self = userSelf.self();

		if(!self){
			userSelf.addListener(_name,function(user){
				self = user;
			})
		}

		$scope.messageCount = 0;
		// messages
		if(messageList.checkListener(_name,roomId)){
			$scope.messageCount = messageList.list(roomId).length; 
			$scope.messageList = classHandle(messageList.list(roomId));
		}else{
			messageList.addListener(_name,roomId,function(list){
				$scope.messageCount = list.length;
				$scope.messageList = classHandle(list);
				// });
			});
		}
		$scope.messageList = classHandle($scope.messageList);

		// dom元素class处理
		function classHandle(list){
			angular.forEach(list,function(message,index){
				message.class = '';
				// 如果上条消息也是该用户发表的
				// 则显示为碎片模式
				if(index > 0 && list[index].sender._id == list[index-1].sender._id){
					message.class += ' fragment';
				}

				// 我发的
				if(message.sender._id == self._id){
					message.class += ' own';
				}
			});

			return list;
		}
	}]);

app.controller('messagePrivateCtrl',['$scope','$modalInstance','user','list','messagePrivate','userSelf',
	function($scope,$modalInstance,user,list,messagePrivate,userSelf){
		var self = userSelf.self();
		$scope.user = user;
		$scope.list = classHandle(list);
		$scope.self = self;
		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.send = function(){
			messagePrivate.emit({_id:user._id,text:$scope.text});
			$scope.text = '';
		}

		messagePrivate.addListener('messagePrivate',function(data){
			if(data.reciever == self._id || data.sender == self._id){
				$scope.list = classHandle(messagePrivate.list(user._id));
			}
		});

		function classHandle(list){
			angular.forEach(list,function(message,index){
				message.class = '';
				// 如果上条消息也是该用户发表的
				// 则显示为碎片模式
				if(index > 0 && list[index].sender == list[index-1].sender){
					message.class += ' fragment';
				}

				// 我发的
				if(message.sender == self._id){
					message.class += ' own';
				}
			});

			return list;
		}
	}]);