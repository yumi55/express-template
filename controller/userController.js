const { User, Like } = require('../model/index')
const { createToken } = require('../util/jwt')
const fs = require('fs')
const { promisify } = require('util')
const rename = promisify(fs.rename)
exports.register = async (req, res) => {
    const userModel = new User(req.body)
    const dbBack = await userModel.save()
    const user = dbBack.toJSON()
    delete user.password // 保存还在显示password 则需要手动删除
    res.status(201).json({
        user
    })
};
// 用户登录
exports.login = async (req, res) => {
    let userinfo = await User.findOne(req.body)
    if (!userinfo) {
        return res.status(401).json({ msg: '邮箱或密码错误！' })
    }
    userinfo = userinfo.toJSON()
    userinfo.token = await createToken(userinfo)
    res.status(200).json(userinfo)
}
// 更改用户信息
exports.update = async (req, res) => {
    const id = req.user.userInfo._id
    const dbBack = await User.findByIdAndUpdate(id, req.body, { new: true })
    res.status(202).json({ user: dbBack })
}
exports.headimg = async (req, res) => {
    // console.log(req.file)
    // {
    //     fieldname: 'headimg',
    //     originalname: '20200411151851_bejgw.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg',
    //     destination: 'public/',
    //     filename: '6ccaa07cfee2a36c30846baae89f4116',
    //     path: 'public/6ccaa07cfee2a36c30846baae89f4116',
    //     size: 82136
    //   }
    const { filename, originalname } = req.file
    const nameArr = originalname.split('.')
    const suffix = nameArr[nameArr.length - 1]
    try {
        await rename(
            './public/' + filename,
            './public/' + filename + '.' + suffix
        )
        const id = req.user.userInfo._id
        await User.findByIdAndUpdate(id, {
            image: filename + '.' + suffix
        }, { new: true })
        res.status(200).json({ filePath: filename + '.' + suffix })

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: error })
    }
}
// 用户列表
exports.list = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10 } = req.body
        const list = await User.find()
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ updateAt: -1 })
        const total = await User.countDocuments() //  获取list总数
        res.status(200).json({ list, total })
    } catch (e) {
        res.status(500).json({ msg: e })
    }
}
// 删除用户
exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        const dbBack = await User.findOne({ _id: id })
        if (dbBack) {
            await dbBack.deleteOne({ _id: id })
            res.status(200).json({ msg: '删除用户成功！' })
        }
    } catch (e) {
        res.status(500).json({ msg: e })
    }
};
// 点赞博客
exports.like = async (req, res) => {
    try {
        const { id: blogId } = req.params
        const userId = req.user.userInfo._id
        const record = await Like.findOne({
            userId: userId,
            blogId: blogId
        })
        if (!record) {
            await new Like({
                userId: userId,
                blogId: blogId
            }).save()
            const user = await User.findById(userId)
            user.likes ? user.likes.push(blogId) : [blogId]
            user.save()
            res.status(200).json({ msg: '点赞博客成功！' })
        } else {
            res.status(500).json({ msg: '你已经点赞了！' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
};
// 取消点赞博客
exports.unlike = async (req, res) => {
    try {
        const { id: blogId } = req.params
        const userId = req.user.userInfo._id
        const record = await Like.findOne({
            userId: userId,
            blogId: blogId
        })
        if (record) {
            await Like.deleteOne({ _id: record._id })
            const user = await User.findById(userId)
            const index = user.likes.findIndex(item => item === blogId)
            user.likes.splice(index, 1)
            user.save()
            res.status(200).json({ msg: '取消点赞博客成功！' })
        } else {
            res.status(500).json({ msg: '你没有点赞过该博客！' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
};