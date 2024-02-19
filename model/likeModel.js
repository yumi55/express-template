// 用户点赞博客
const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const LikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    blogId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Blog'
    },
    ...baseModel
})

module.exports = LikeSchema