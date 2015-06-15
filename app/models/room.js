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
    participants: [{ // We can have an array per role
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

module.exports = mongoose.model('Room', RoomSchema);