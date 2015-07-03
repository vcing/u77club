var _            = require('lodash');

function connection(){
	var app          = this.app;
	var middlewares  = this.middlewares;
	var models       = this.models;
	var type         = 'connection';
	var common       = this.common;
	var addOnline    = common.addOnline;
	var removeOnline = common.removeOnline;
	var onlineList   = common.onlineList;
	var errorHandle  = common.errorHandle;

	/**
	 * 20150619
	 * 注册socket的连接和失去连接事件
	 * @param  {Object}		socket对象
	 * @return {null}
	 */
	app.io.on('connection',function(socket){
		if(!socket.session || !socket.session.user){
			socket.emit('system:nologin');
			return false;
		}
		// var socket = socket;
		// 当socket连接时
		// 获取socket的user所在的房间
		// 遍历所有房间 并且进入
		// 如果该user的该socket是这个房间内唯一的
		// 则通知所有人 该user进入房间
		// 否则只通知自己 进入房间成功
		_.forEach(socket.session.user.rooms,function(room){
			models.room.findById(room).exec(errorHandle(null,type,function(room){
				if(!room){
					socket.emit('system:room','wrong room id');
					return false;
				}
				console.log('connect');
				if(room.users.length != 0){
					var users = room.users.toString().split(',');
					console.log(users);
					if(_.indexOf(users,socket.session.user._id.toString()) == -1){
						room.users.push(socket.session.user._id);
					}else{
						socket.join(room._id);
						var data = {
							_id:room._id,
							user:socket.session.user
						};
						socket.emit('room:join',data);
						return true;
					}
				}else{
					room.users = [socket.session.user._id];
					console.log(room.users);
				}
				room.save();
				socket.join(room._id);
				var data = {
					_id:room._id,
					user:socket.session.user
				};
				app.io.to(room._id).emit('room:join',data);
			}));
		});
		
		addOnline(socket);
		
		socket.on('disconnect',function(){		
			removeOnline(socket);
			var _onlineList = onlineList();
			_.forEach(socket.session.user.rooms,function(room){
				models.room.findById(room).exec(errorHandle(null,type,function(room){
					if(!room){
						socket.emit('system:room','wrong room id');
						return false;
					}
					if(room.users){
						var users = room.users.toString().split(',');
						if(_.indexOf(users,socket.session.user._id.toString()) == -1){
							socket.emit('system:room','you are not in this room already');	
						}else{
							_.remove(users,function(n){
								return n == socket.session.user._id.toString();
							});
							room.users = users;
							room.save(errorHandle(null,type,function(){
								socket.emit('system:room',{action:'leave',status:0,msg:'ok',_id:room._id});		
							}));
						}
					}else{
						socket.emit('system:room','no user in this room');
					}
					room.save();
					socket.leave(room._id);
					var data = {
						_id:room._id,
						user:socket.session.user
					};
					app.io.to(room._id).emit('room:leave',data);
				}));
			});	
		});
		socket.on('reconnect',function(){
			var socket = socket;
			_.forEach(socket.session.user.rooms,function(room){
				models.room.findById(room).exec(errorHandle(null,type,function(room){
					if(!room){
						socket.emit('system:room','wrong room id');
						return false;
					}
					console.log('reconnect');
					if(room.users){
						var users = room.users.toString().split(',');
						if(_.indexOf(users,socket.session.user._id.toString()) == -1){
							room.users.push(socket.session.user._id);
						}else{
							socket.join(room._id);
							socket.emit('room:join',socket.session.user);
							return true;
						}
					}else{
						room.users = [socket.session.user._id];
					}
					room.save();
					socket.join(room._id);
					app.io.to(room._id).emit('room:join',socket.session.user);
				}));
			});
			addOnline(socket);
		});
	});


	app.io.route(type,{
		/**
		 * 20150619
		 * 获取在线列表
		 * @param  {Object} req 请求对象
		 * @param  {Object} res 响应对象
		 * @return {null}
		 */
		list:function(req,res){
			req.socket.emit(type+':list',JSON.stringify(onlineList()));
		}
	})
	
}

module.exports = connection;