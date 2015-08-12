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
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    support:{
        type:Number,
        default: 0
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
    return this.find({room:_id}).populate('sender').sort('-date').exec();
}

ActiveSchema.statics.findBySender = function(_id){
    return this.find({sender:_id}).populate('sender').sort('-date').exec();
}

ActiveSchema.statics.support = function(_id){
    return this.findOneAndUpdate({_id:_id},{'$inc':{support:1}}).exec();
}

module.exports = mongoose.model('Active', ActiveSchema);