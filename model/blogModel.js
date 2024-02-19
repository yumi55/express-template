const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: null
    },
    user: { // 与user关联 绑定blog作者
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    ...baseModel
})

module.exports = blogSchema