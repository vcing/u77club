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

		var socket = socket;
		var _onlineList = onlineList();

		if(!_onlineList[socket.session.user._id]){
			_.forEach(socket.session.user.rooms,function(room){
				models.room.findById(room).exec(errorHandle(null,type,function(room){
					if(!room){
						socket.emit('system:room','wrong room id');
						return false;
					}
					if(room.users.length != 0){
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
		}

		addOnline(socket);
		
		socket.on('disconnect',function(){
			
			removeOnline(socket);
			var _onlineList = onlineList();
			if(!_onlineList[socket.session.user._id]){
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
						app.io.to(room._id).emit('room:leave',socket.session.user);
					}));
				});	
			}
			
		});
		socket.on('reconnect',function(){
			var socket = socket;
			var _onlineList = onlineList();

			if(!_onlineList[socket.session.user._id]){
				_.forEach(socket.session.user.rooms,function(room){
					models.room.findById(room).exec(errorHandle(null,type,function(room){
						if(!room){
							socket.emit('system:room','wrong room id');
							return false;
						}
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
			}
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