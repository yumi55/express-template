const mongoose = require('mongoose')
const { mongodbPath } = require('../config/config.default')
async function main() {
    await mongoose.connect(mongodbPath)
}

main().then(res => {
    console.log('mongodb 链接成功')
}).catch(err => {
    console.log(err)
    console.log('mongodb 链接失败')
})

module.exports = {
    User: mongoose.model('User', require('./userModel')),
    Blog: mongoose.model('Blog', require('./blogModel')),
    Like: mongoose.model('Like', require('./likeModel')),
}
