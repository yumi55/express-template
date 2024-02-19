const mongoose = require('mongoose')
const md5 = require('../util/md5')

const baseModel = require('./baseModel')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        set: value => md5(value),
        select: false // 数据库查询时不显示该字段
    },
    cover: {
        type: String,
        default: null
    },
    ...baseModel
})

module.exports = userSchema