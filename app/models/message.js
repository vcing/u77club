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
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    active: {
        type: ObjectId,
        ref: 'Active'
    }
});

/**
 * 20150619
 * 根据room._id 获取消息列表
 * @param  {int}   id 房间的_id
 * @param  {Function} cb 回调函数
 * @return {null}
 */
MessageSchema.statics.findByRoom = function(id,cb){
    this.find({room:id}).populate('sender').sort('date').exec(cb);
}

MessageSchema.statics.findByActive = function(_id,cb){
    this.find({active:_id}).populate('sender').sort('-date').exec(cb);
}

module.exports = mongoose.model('Message', MessageSchema);