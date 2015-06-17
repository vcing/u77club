'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var MessageSchema = new mongoose.Schema({
    room: {
        type: ObjectId,
        ref: 'Room',
        required: true
    },
    sender: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
});

MessageSchema.statics.findByRoom = function(id,cb){
    this.find({room:id}).populate('sender').sort('-date').exec(cb);
}

module.exports = mongoose.model('Message', MessageSchema);