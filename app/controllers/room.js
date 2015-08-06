var _           = require('lodash');

function room(){
	var app          = this.app;
	var middlewares  = this.middlewares;
	var models       = this.models;
	var type         = 'room';
	var common       = this.common;
	var addOnline    = common.addOnline;
	var removeOnline = common.removeOnline;
	var onlineList   = common.onlineList;
	var errorHandle  = common.errorHandle;
	var emit		 = common.emit;
	var join		 = common.join;
	var leave		 = common.leave;

	app.io.route(type,{
		create:function(req,res){
			var type = 1;
			if(req.param('private') && req.param('password')){
				type = 4;
			}else if(req.param('private')){
				type = 3;
			}else if(req.param('password')){
				type = 2;
			}
			var options = {
				name:req.param('name'),
				description:req.param('description'),
				type:type,
				password:req.param('password'),
				owner:req.session.user
			}
			models.room.createRoom(options,errorHandle(req,type,function(room){
				res.status(200).json('hehe');
				req.socket.emit('room:create',{action:'create',_id:room._id,status:0,msg:'ok'});

				if(req.param('password')){
					models.roomPermission.create({roomId:room._id,users:[req.session.user._id]},errorHandle(req,type));
				}
			}));


			
		},
		info:function(req,res){
			models.room.findById(req.param('_id')).exec(errorHandle(req,type,function(room){
				req.socket.emit('room:info',room);
			}));
		},
		list:function(req,res){
			models.room.roomList(errorHandle(req,type,function(rooms){
				req.socket.emit('room:list',rooms);
			}));
			req.socket.emit('online:list',JSON.stringify(onlineList()));
		},
		join:function(req,res){
			// room 的 user为房间的在线列表
			models.room.findById(req.param('_id')).exec(errorHandle(req,type,function(room){
				if(!room){
					req.socket.emit('system:room','wrong room id');
					return false;
				}
				if(room.users){
					// 多页面的处理 保证该用户在多个窗口下打开该房间 
					// 只有一条用户信息 显示在房间的在线列表
					var users = room.users.toString().split(',');
					if(_.indexOf(users,req.session.user._id.toString()) == -1){
						room.users.push(req.session.user._id);
					}else{
						req.socket.join(room._id);
						var data = {
							user:req.session.user,
							_id:room._id
						};
						emit(req,'room:join',data);
						return true;
					}
				}else{
					room.users = [req.session.user._id];
				}
				// 保存房间在线列表
				// socket加入房间
				room.save();
				join(req,room._id);
				var data = {
					user:req.session.user,
					_id:room._id
				};
				app.io.to(room._id).emit('room:join',data);
			}));
		},
		leave:function(req,res){
			models.room.findById(req.param('_id')).exec(errorHandle(req,type,function(room){
				if(!room){
					req.socket.emit('system:room','wrong room id');
					return false;
				}
				if(room.users){
					var users = room.users.toString().split(',');
					if(_.indexOf(users,req.session.user._id.toString()) == -1){
						req.socket.emit('system:room','you are not in this room already');	
					}else{
						_.remove(users,function(n){
							return n == req.session.user._id.toString();
						});
						room.users = users;
						room.save(errorHandle(req,type,function(){
							emit(req,'system:room',{action:'leave',status:0,msg:'ok',_id:room._id});
						}));
					}
				}else{
					emit(req,'system:room','no user in this room');
				}
				room.save();
				leave(req,room._id);
				var data = {
					user:req.session.user,
					_id:room._id
				};
				app.io.to(room._id).emit('room:leave',data);
			}));
		},
		delete:function(req,res){

		},
		subscribe:function(req,res){
			var is_subscribe = true;
			models.user.findById(req.session.user._id,errorHandle(req,type,function(user){
				if(user.rooms){
					var rooms = user.rooms.toString().split(',');
					if(_.indexOf(rooms,req.param('_id')) == -1){
						is_subscribe = true;
						user.rooms.push(req.param('_id'));	
					}else{
						is_subscribe = false;
						_.remove(rooms,function(n){
							return n == req.param('_id');
						});
						user.rooms = rooms;
					}
				}else{
					user.rooms = [req.param('_id')];
				}
				user.save(errorHandle(req,type,function(){
					req.session.user = user;
					req.session.save();
					if(is_subscribe){
						// 如果是加密房间 则验证
						if(req.param('hasPassword')){
							models.roomPermission.valid(req.param('_id'),req.session.user._id,function(result){
								if(result){
									req.io.route('room:join');		
								}else{
									req.socket.emit('system:error','you do not have permission to enter this room');
								}
							});
							// 创建用户房间活动
						}else{
							req.io.route('room:join');
						}
						models.userRoomActive.addRoomActive(req);
					}else{
						if(req.param('hasPassword')){
							// 如果是加密房间则将该用户从 加密房间的授权列表中删除
							models.roomPermission.kick(req.param('_id'),req.session.user._id);
						}
						req.io.route('room:leave');	
						models.userRoomActive.removeRoomActive(req);
					}
					// req.socket.emit('room:subscribe',{status:0,msg:'ok'});
					emit(req,'room:subscribe',{status:0,msg:'ok'});
				})); 
			}));
		},
		listbyids:function(req,res){
			var _ids = req.param('_ids');
			models.room.find({_id:{$in:_ids}}).select('_id name description owner created users').exec(errorHandle(req,type,function(rooms){
				models.userRoomActive.getUserMessageRemind(req,function(result){
					if(result){
						var _rooms = [];
						_.forEach(rooms,function(room,index){
							_rooms[index]               = {};
							_rooms[index]._id           = room._id;
							_rooms[index].name          = room.name;
							_rooms[index].description   = room.description;
							_rooms[index].owner         = room.owner;
							_rooms[index].created       = room.created;
							_rooms[index].users         = room.users;
							_rooms[index].messageRemind = result[room._id];
						});
						req.socket.emit('room:listbyids',_rooms);	
					}else{
						req.socket.emit('room:listbyids',rooms);
					}
					
				});
			}));
		},
		userlist:function(req,res){
			models.room.findById({_id:req.param('_id')}).populate('users').exec(errorHandle(req,type,function(room){
				req.socket.emit('room:userlist',room);
			}));
		},
		valid:function(req,res){
			models.room.findById(req.param('_id')).exec(errorHandle(req,type,function(room){
				if(room && req.param('password') && req.param('password') == room.password){
					models.roomPermission.add(req.param('_id'),req.session.user._id);
					req.socket.emit('room:valid',{_id:req.param('_id'),status:0,msg:'ok'});
				}else{
					req.socket.emit('room:valid',{_id:req.param('_id'),status:101,msg:'wrong password'});
				}
			}));
			
		},
		permission:function(req,res){
			models.roomPermission.valid(req.param('roomId'),req.session.user._id,function(result){
				if(result){
					req.socket.emit('room:permission',{_id:req.param('roomId'),status:0,msg:'ok'});
				}else{
					// models.room.findById(req.param('roomId')).exec(errorHandle(req,type,function(room){
					// 	if(room && req.param('password') && req.param('password') == room.password){
					// 		req.socket.emit('room:permission',{_id:req.param('roomId'),status:0,msg:'ok'});
					// 	}else{
					// 		req.socket.emit('room:permission',{_id:req.param('roomId'),status:101,msg:'no permission'});
					// 	}
					// }));
					req.socket.emit('room:permission',{_id:req.param('roomId'),status:101,msg:'no permission'});
				}
			});
		},
		updateactive:function(req,res){
			models.userRoomActive.addRoomActive(req);
		}
	});
}

module.exports = room;