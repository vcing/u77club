var _      = require('lodash');
var common = require('../common');

function room(){
	var app         = this.app;
	var middlewares = this.middlewares;
	var models      = this.models;
	var type        = 'room';

	app.io.route(type,{
		create:function(req,res){
			var options = {
				name:req.param('name'),
				description:req.param('description'),
				private:req.param('private') || false,
				password:req.param('password') || false,
				owner:req.session.user
			}
			var room = models.room.createRoom(options,common.errorHandle(req,type,function(){
				res.status(200).json('hehe');
				req.socket.emit('system:room',{action:'create',_id:room._id,status:0,msg:'ok'});
			}));
			
		},
		list:function(req,res){
			var rooms = models.room.roomList(common.errorHandle(req,type,function(rooms){
				req.socket.emit('room:list',rooms);
			}));
		},
		join:function(req,res){
			models.room.findById(req.param('_id')).exec(common.errorHandle(req,type,function(room){
				if(!room){
					req.socket.emit('system:room','wrong room id');
					return false;
				}
				if(room.users){
					var users = room.users.toString().split(',');
					if(_.indexOf(users,req.session.user._id.toString()) == -1){
						room.users.push(req.session.user._id);	
					}else{
						req.socket.join(room._id);
						req.socket.emit('room:join',req.session.user);
						return true;
					}
				}else{
					room.users = [req.session.user._id];
				}
				room.save(req,type);
				req.socket.join(room._id);
				app.io.to(room._id).emit('room:join',req.session.user);
			}));
		},
		leave:function(req,res){
			models.room.findById(req.param('_id')).exec(common.errorHandle(req,type,function(room){
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
						room.save(common.errorHandle(req,type,function(){
							req.socket.emit('system:room',{action:'leave',status:0,msg:'ok',_id:room._id});		
						}));
					}
				}else{
					req.socket.emit('system:room','no user in this room');
				}
				req.socket.leave(room._id);
				app.io.to(room._id).emit('room:leave',req.session.user);
			}));
		},
		delete:function(req,res){

		},
		subscribe:function(req,res){
			var is_subscribe = true;
			// models.room.findById(req.param('_id')).exec(common.errorHandle(req,type,function(room){
			// 	var users = room.users.toString().split(',');
			// 	console.log(_.indexOf(users,req.session.user._id));
			// 	return false;
			// 	if(!room){
			// 		req.socket.emit('system:room','wrong room id');
			// 		return false;
			// 	}
			// 	if(room.users){
			// 		if(_.indexOf(users,req.session.user._id) == -1){
			// 			is_subscribe = true;
			// 			room.users.push(req.session.user._id);
			// 		}else{
			// 			is_subscribe = false;
			// 			_.remove(room.users,function(n){
			// 				return n == req.session.user._id;
			// 			});
			// 		}
			// 	}else{
			// 		room.users = [req.session.user._id];
			// 	}
			// 	room.save(common.errorHandle(req,type));
			// }));
			// return false;
			models.user.findById(req.session.user._id,common.errorHandle(req,type,function(user){
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
				user.save(common.errorHandle(req,type,function(){
					req.session.user = user;
					if(is_subscribe){
						req.io.route('room:join');
					}else{
						req.io.route('room:leave');
					}
				})); 
			}));
		}
	});
}

module.exports = room;