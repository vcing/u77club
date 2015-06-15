'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
	username:{
		type:String,
		require:true,
		trim:true,
		unique:true
	},
	email:{
		type:String,
		require:true,
		trim:true,
		unique:true
	},
	password:{
		type:String,
		require:true,
		trim:true
	},
	nickname:{
		type:String,
		require:true,
		trim:true
	},
	statue:{
		type:Number,
		trim:true,
		default:1
	},
	encrypt:{
		type:String,
		trim:true,
		default:'u77'
	},
	v_type:{
		type:String,
		trim:true
	},
	avatar:{
		type:String,
		trim:true,
		default:"u77_avatar.jpg"
	},
	rooms:[{
		type:ObjectId,
		ref:"Room"
	}],
	messages:[{
		type:ObjectId,
		ref:"Message"
	}]
});

UserSchema.statics.auth = function(username,password){
	var user = this.find({username:username});
	if(user.password == password){
		return true;
	}else{
		return false;
	}
}

module.exports = mongoose.model('User', UserSchema);