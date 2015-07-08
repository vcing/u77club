'use strict';
var _        = require('lodash');

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var roomPermissionSchema = mongoose.Schema({
	roomId:{
		type:String,
		required: true,
		unique:true
	},
	users:[{
		type:String,
	}]
});

roomPermissionSchema.statics.create = function(options,errorhandle){
	var permission = new this(options);
	permission.save(errorhandle);
}

roomPermissionSchema.statics.valid = function(roomId,userId,cb){
	var _valid = false;
	this.findOne({roomId:roomId}).exec(function(err,data){
		_.forEach(data.users,function(_id){
			if(_id == userId){
				_valid = true;
			}
		})
		cb(_valid);
	});
}

roomPermissionSchema.statics.add = function(roomId,userId){
	this.findOne({roomId:roomId}).exec(function(err,data){
		if(_.indexOf(data.users,userId) == -1){
			data.users.unshift(userId);	
		}
		data.save()
	});
}

roomPermissionSchema.statics.kick = function(roomId,userId){
	this.findOne({roomId:roomId}).exec(function(err,data){
		while(_.indexOf(data.users,userId) != -1){
			data.users.splice(_.indexOf(data.users,userId),1);
		}
		data.save();
	})
}

module.exports = mongoose.model('RoomPermission', roomPermissionSchema);