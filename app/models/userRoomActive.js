'use strict';

var _        = require('lodash');

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var errorHandle = require('../common').errorHandle;

var message = require('./message');

var userMessage = require('./userMessage');

var RoomLastActiveSchema = new mongoose.Schema({
	room:{
		type:String,
		required:true
	},
	lastActive:{
		type:Date,
		default:Date.now
	}
});

var PrivateLastActiveSchema = new mongoose.Schema({
	user:{
		type:String,
		require:true
	},
	lastActive:{
		type:Date,
		default:Date.now
	},
	status:{
		type:Number,
		default:1
	}
})

var UserRoomActiveSchema = new mongoose.Schema({
	user:{
		type: String,
        required: true,
        unique: true
	},
	roomLastActive:[RoomLastActiveSchema],
	privateLastActive:[PrivateLastActiveSchema]
});

UserRoomActiveSchema.statics.addRoomActive = function(req){
	var type = 'addRoomActive';
	var _this = this;
	this.findOne({user:req.session.user._id}).exec(errorHandle(req,type,function(active){
		if(active){
			var _haveActive = false;
			_.forEach(active.roomLastActive,function(lastActive){
				if(lastActive.room == req.param('_id')){
					lastActive.lastActive = Date.now();
					_haveActive = true;
				}
			});

			if(!_haveActive){
				
				active.roomLastActive.unshift({
					room:req.param('_id'),
					lastActive:Date.now()
				});
			}
			active.markModified('roomLastActive');
			active.save();
		}else{
			var options = {
				user:req.session.user._id,
				roomLastActive:[],
				privateLastActiveSchema:[]
			}
			if(req.param('_id'))options.roomLastActive.unshift({room:req.param('_id')});

			var _active = new _this(options);
			
			_active.save(errorHandle(req,type));
		}
	}));
}

UserRoomActiveSchema.statics.removeRoomActive = function(req){
	var type = 'removeRoomActive';
	this.findOne({user:req.session.user._id}).exec(errorHandle(req,type,function(active){
		if(active){
			_.remove(active.roomLastActive,function(lastActive){
				return lastActive.room == req.param('_id');
			});
		}

		// 坑！
		// 子文档 属于混合类型
		// 更新的时候要用 markModified 更新
		active.markModified('roomLastActive');
		active.save(errorHandle(req,type));
	}));
}

UserRoomActiveSchema.statics.getUserRoomLastActive = function(req,cb){
	var type = 'getUserRoomLastActive';
	this.findOne(
	{
		"user":req.session.user._id,
		// "user.roomLastActive.room":req.param('_id')
	}).exec(errorHandle(req,type,function(active){
		_.forEach(active.roomLastActive,function(active){
			if(active.room == req.param('_id')){
				cb(active);	
			}
		});
	}));
}

UserRoomActiveSchema.statics.getUserActives = function(req,cb){
	var type = 'getUserActives';
	this.findOne({
		"user":req.session.user._id
	}).exec(errorHandle(req,type,function(actives){
		cb(actives);
	}));
}

UserRoomActiveSchema.statics.getUserMessageRemind = function(req,cb){
	var type = 'getUserMessageRemind';
	var result = {};
	var _this = this;
	this.getUserActives(req,function(actives){
		if(!actives){
			_this.addRoomActive(req);
			cb();
		}else{
			_.forEach(actives.roomLastActive,function(active,index){
				message.count({room:active.room,date:{'$gt':active.lastActive}},errorHandle(req,type,function(count){
					result[active.room] = count;
					if(index+1 == actives.roomLastActive.length){
						cb(result);
					}
				}))
			});
			if(actives.roomLastActive.length == 0){
				_this.addRoomActive(req);
				cb();
			}
		}
		
	})
}


UserRoomActiveSchema.statics.addPrivateActive = function(req){
	var type = 'addPrivateActive';
	var _this = this;
	this.findOne({user:req.session.user._id}).exec(errorHandle(req,type,function(active){
		if(active){
			var _haveActive = false;
			_.forEach(active.privateLastActive,function(lastActive){
				if(lastActive.user == req.param('_id')){
					lastActive.lastActive = Date.now();
					lastActive.status = 1;
					_haveActive = true;
				}
			});

			if(!_haveActive){
				active.privateLastActive.unshift({
					user:req.param('_id'),
					lastActive:Date.now(),
					status:1
				});
			}

			active.markModified('privateLastActive');
			active.save();

		}else{
			var options = {
				user:req.session.user._id,
				roomLastActive:[],
				privateLastActiveSchema:[]
			}
			if(req.param('_id'))options.privateLastActive.unshift({user:req.param('_id')});
			var _active = new _this(options);
			_active.save(errorHandle(req,type));
		}
	}));

	// 给对方的私聊活动列表中加上我
	this.findOne({user:req.param("_id")}).exec(errorHandle(req,type,function(active){
		if(active){
			var _haveActive = false;
			_.forEach(active.privateLastActive,function(lastActive){
				if(lastActive.user == req.session.user._id){
					lastActive.status = 1;
					_haveActive = true;
				}
			});

			if(!_haveActive){
				active.privateLastActive.unshift({
					user:req.session.user._id,
					lastActive:Date.now()-1,
					status:1
				})
			}

			active.markModified('privateLastActive');
			active.save();
		}else{
			var options = {
				user:req.session.user._id,
				roomLastActive:[],
				privateLastActiveSchema:[]
			}
			options.privateLastActive.unshift({user:req.session.user._id});
			var _active = new _this(options);
			_active.save(errorHandle(req,type));	
		}
	}));
}

UserRoomActiveSchema.statics.hidePrivateActive = function(req){
	var type = 'hidePrivateActive';
	this.findOne({user:req.session.user._id}).exec(errorHandle(req,type,function(active){
		if(active){
			_.forEach(active.privateLastActive,function(lastActive){
				if(lastActive.user == req.param('_id')){
					lastActive.status = 2;
				}
			});
		}else{
			req.socket.emit('system:error','can not hide this private message box');
		}

		active.markModified('privateLastActive');
		active.save(errorHandle(req,type));
	}));
}

UserRoomActiveSchema.statics.getPrivateMessageRemind = function(req,cb){
	var type = 'getPrivateMessageRemind';
	var result = {};
	var _this = this;
	this.getUserActives(req,function(actives){
		if(!actives){
			_this.addPrivateActive(req);
			cb();
		}else{
			_.forEach(actives.privateLastActive,function(active,index){
				// OMG
				// 这里是查询有多少条未读私信的查询语句
				userMessage.count({
					"$or":[{
						sender:req.session.user._id,
						receiver:active.user
					},{
						receiver:req.session.user._id,
						sender:active.user
					}],
					date:{"$gt":active.lastActive},
					status:1
				},errorHandle(req,type,function(count){
					result[active.user] = count;
					if(index + 1 == actives.privateLastActive.length){
						cb(result);
					}
				}));
			});
			if(actives.privateLastActive.length == 0){
				cb({});
			}
		}
		
	})
}


module.exports = mongoose.model('UserRoomActive', UserRoomActiveSchema);