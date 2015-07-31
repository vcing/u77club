'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var ActiveSchema = new mongoose.Schema({
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
    original: {
    	type: ObjectId,
    	ref: 'Active'
    },
    type: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
});

ActiveSchema.statics.findByRoom = function(_id){
    return this.find({room:_id}).sort('-date').exec();
}

ActiveSchema.statics.findBySender = function(_id){
    return this.find({sender:_id}).sort('-date').exec();
}

module.exports = mongoose.model('Active', ActiveSchema);