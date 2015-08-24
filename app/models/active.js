'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var message = require('./message');

var errorHandle = require('../common').errorHandle;

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
    commentCount:{
        type:Number,
        default: 0
    },
    repostCount:{
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

ActiveSchema.set('toJSON', {
    virtuals: true
});

// ActiveSchema.statics.info = function(req,_id){
//     var promise = new mongoose.Promise;
//     var result;
//     this.findById(_id).populate('sender')
//     .then(function(active){
//         result = {
//             _id:active._id,
//             room:active.room,
//             sender:active.sender,
//             title:active.title,
//             content:active.content,
//             support:active.support,
//             original:active.original,
//             type:active.type,
//             date:active.date
//         }
//         return message.where({active:_id}).count();
//     }).then(function(count){
//         result.commentCount = count;
//         return module.exports.where({original:_id}).count();
//     }).then(function(count){
//         result.repostCount = count;
//         promise.complete(result);
//     });
//     return promise;
// }

ActiveSchema.statics.findByRoom = function(_id){
    return this.find({room:_id}).sort('-date').exec();
}

ActiveSchema.statics.findBySender = function(_id){
    return this.find({sender:_id}).sort('-date').exec();
}

ActiveSchema.statics.support = function(_id){
    return this.findOneAndUpdate({_id:_id},{'$inc':{support:1}}).exec();
}

ActiveSchema.statics.repostPlus = function(_id){
    return this.findOneAndUpdate({_id:_id},{'$inc':{repostCount:1}}).exec();   
}

ActiveSchema.statics.commentPlus = function(_id){
    return this.findOneAndUpdate({_id:_id},{'$inc':{commentCount:1}}).exec();
}

module.exports = mongoose.model('Active', ActiveSchema);