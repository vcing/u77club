app.service('roomList',['$q',function($q){
	var deferred = $q.defer();

	socket.on('room:list',function(data){
		deferred.resolve(data);
	});	

	return function(){
		socket.emit('room:list');
		return deferred.promise;
	};
	

	
}]);

app.service('roomJoin',['$q',function($q){
	var deferred = $q.defer();
	
	socket.on('room:join',function(data){
		deferred.resolve(data);
	})

	return function(_id){
		socket.emit('room:join',{_id:_id});
		return deferred.promise;
	}
}]);