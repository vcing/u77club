'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var UserInfoSchema = new mongoose.Schema({
	userId:{
		type:ObjectId,
		ref:"User"
	},
	support:[{
		type:ObjectId,
		ref:'Active'
	}],
	favorite:[{
		type:ObjectId,
		ref:'Active'
	}]
});

UserInfoSchema.statics.create = function(options){
	var _info = new this(options);
	_info.save();
	return _info;
}

UserInfoSchema.statics.findByUser = function(_id){
	return this.findOne({userId:_id}).exec();
}

UserInfoSchema.statics.findActivesByUser = function(_id){
	return this.findOne({userId:_id}).populate('support favorite').exec();
}

module.exports = mongoose.model('UserInfo', UserInfoSchema);