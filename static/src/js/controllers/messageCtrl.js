app.controller('messagePrivateCtrl',['$scope','$modalInstance','data','messagePrivate','userSelf',
	function($scope,$modalInstance,data,messagePrivate,userSelf){
		var user;
		$scope.messageList = [];
		$scope.messageCount = 0;

		var self = userSelf.self();
		$scope.self = self;

		data.getPrivateMessages(data._id).then(function(data){
			user = data.user;
			$scope.user = data.user;
			$scope.messageList = classHandle(data.list);
			$scope.messageCount = data.list.length;

			messagePrivate.addListener('messagePrivate',function(data){
				if(data.receiver == self._id || data.sender == self._id){
					messagePrivate.clearCount(user._id);
					$scope.messageList = classHandle(messagePrivate.list(user._id));
					$scope.messageCount = messagePrivate.list(user._id).length;
					messagePrivate.updateActive(user._id);
				}else if(data.list){
					$scope.messageList = classHandle(messagePrivate.list(user._id));
					$scope.messageCount = messagePrivate.list(user._id).length;
				}
			});
		});
		
		$scope.cancel = function(){
			messagePrivate.removeListener('messagePrivate')
			$modalInstance.dismiss('cancel');
		}

		$scope.send = function(){
			messagePrivate.emit({_id:user._id,text:$scope.text});
			$scope.text = '';
		}

		$scope.loadMore = function(){
			messagePrivate.prev(user._id);
		}

		

		function classHandle(list){
			angular.forEach(list,function(message,index){
				message.class = '';
				// 如果上条消息也是该用户发表的
				// 并且在5分钟内
				// 则显示为碎片模式
				

				var thisMsgDate = moment(list[index].date);
				var prevMsgDate = index > 1 ? moment(list[index-1].date) : 0;
				if(index > 0 && list[index].sender == list[index-1].sender && thisMsgDate.diff(prevMsgDate,'minutes') < 5){
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