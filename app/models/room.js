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
	messages: [{
		type: ObjectId,
		ref: 'Message'
	}],
    created: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    private: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: false//only for password-protected room
    }
});

RoomSchema.statics.createRoom = function(options,errorHandle){
    var room = new this(options);
    room.save(errorHandle);
}

RoomSchema.statics.roomList = function(errorHandle){
    this.find().select('_id name users').populate('users').exec(errorHandle);

}

module.exports = mongoose.model('Room', RoomSchema);