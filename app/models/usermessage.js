'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var UserMessageSchema = new mongoose.Schema({
    receiver: {
        type: ObjectId,
        ref: 'User',
        index:true
    },
    sender: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type:Number,
        default:1
    }
});

module.exports = mongoose.model('UserMessage', UserMessageSchema);