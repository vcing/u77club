'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
		type: ObjectId,
		ref: 'User',
        required: true
    },
    users: [{ // We can have an array per role
		type: ObjectId,
		ref: 'User'
	}],
	// messages: [{
	// 	type: ObjectId,
	// 	ref: 'Message'
	// }],
    created: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    type: {
        type: Number,
        default: 1  
        // 1:普通公开房间
        // 2:普通加密房间
        // 3:私有房间
        // 4:私有加密房间
    },
    password: {
        type: String,
        required: false//only for password-protected room
    }
});

/**
 * 20150619
 * 创建房间函数
 * @param  {obj} options     房间参数
 * @param  {Function} errorHandle 回调
 * @return {null}
 */
RoomSchema.statics.createRoom = function(options,errorHandle){
    var room = new this(options);
    room.save(function(err){
        errorHandle(err,room);
    });
}

/**
 * 20150619
 * 房间列表
 * @param  {Function} errorHandle 回调
 * @return {null}
 */
RoomSchema.statics.roomList = function(errorHandle){
    this
    .find({type:{$in:[1,2]}})
    .select('_id name users description lastActive type')
    .populate('users','_id nickname avatar').exec(errorHandle);

}

module.exports = mongoose.model('Room', RoomSchema);