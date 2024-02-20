// 用户点赞博客
const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const FollowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    followId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    ...baseModel
})

module.exports = FollowSchema