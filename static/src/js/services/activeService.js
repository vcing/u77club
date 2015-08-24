app.service('activeNew',['socket',
	function(socket){
		return {
			emit:function(options){
				socket.emit('active:new',options);
			}
		}
	}]);

app.service('activeList',['socket','$q',
	function(socket,$q){
		var _cb      = {};
		var _list    = {};

		socket.addListener('active:list',function(data){
			events(data);
		});

		function events(data){
			_list[data._id] = data.actives;
			angular.forEach(_cb,function(fn){
				fn(data);
			});
		}

		return {
			emit:function(options){
				socket.emit('active:list',options);
			},
			addListener:function(name,fn){
				_cb[name] = fn;
			},
			deleteListener:function(name){
				delete _cb[name];
			},
			getActives:function(_id){
				if(_list[_id]){
					return _list[_id]
				}else{
					return null;
				}
			},
			list:function(){
				return _list;
			},
			favoritePromise:function(){
				var deffered = $q.defer();
				socket.emit('active:favorite');
				socket.on('active:favorite',function(data){
					deffered.resolve(data);
				});
				return deffered.promise;
			},
			setActives:function(_id,actives){
				_list[_id] = actives;
			}
		}
	}]);

app.service('activeInfo',['socket','$q',
	function(socket,$q){
		var actives = {};
		return {
			promise:function(_id){
				var deffered = $q.defer();
				if(!actives[_id]){
					actives[_id] = 'loading';
					socket.emit('active:info',{_id:_id});
				}else{
					if(actives[_id] != 'loading'){
						deffered.resolve(actives[_id]);
					}
				}
				socket.on('active:info',function(data){
					if(_id == data._id){
						actives[data._id] = data;
						deffered.resolve(data);
					}
				});
				return deffered.promise;
			},
			getComment:function(_id){
				var deffered = $q.defer();
				socket.emit('active:comment',{_id:_id});
				socket.on('active:comment',function(data){
					deffered.resolve(data);
				});
				return deffered.promise;
			},
			sendComment:function(_id,content){
				socket.emit('active:comment',{_id:_id,content:content});
			},
			support:function(_id){
				socket.emit('active:support',{_id:_id});
			},
			favorite:function(_id){
				socket.emit('active:favorite',{_id:_id});
			},
			repost:function(options){
				socket.emit('active:repost',options);
			}
		}
	}]);