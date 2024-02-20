const { User, Like, Follow } = require('../model/index')
const { createToken } = require('../util/jwt')
const fs = require('fs')
const { promisify } = require('util')
const rename = promisify(fs.rename)
const lodash = require('lodash')
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
// 关注用户
exports.follow = async (req, res) => {
    try {
        const { id: followId } = req.params
        const userId = req.user.userInfo._id

        if (followId === userId) {
            return res.status(401).json({ msg: '不可以关注自己' })
        }
        // 判断是否id有效
        User.findById(followId).then(async (followUser) => {
            const record = await Follow.findOne({
                userId,
                followId
            })
            if (!record) {
                await new Follow({
                    userId,
                    followId
                }).save()
                followUser.fansCount++
                followUser.save()
                const currentUser = await User.findById(userId)
                currentUser.followCount++
                currentUser.save()
                res.status(200).json({ msg: '关注成功' })
            } else {
                res.status(401).json({ msg: '你已经关注过' })
            }
        }).catch((err) => {
            console.log(err)
            res.status(401).json({ msg: '用户不存在' })
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: '关注失败' })
    }
}
// 取消关注
exports.unfollow = async (req, res) => {
    try {
        const { id: unfollowId } = req.params
        const userId = req.user.userInfo._id

        if (unfollowId === userId) {
            return res.status(401).json({ msg: '不可以取消关注自己' })
        }

        // 判断是否id有效
        User.findById(unfollowId).then(async (unfollowUser) => {
            console.log(unfollowUser, 1)
            const record = await Follow.findOne({
                userId,
                followId: unfollowId
            })
            if (record) {
                await Follow.deleteOne({ _id: record._id })
                unfollowUser.fansCount--
                await unfollowUser.save()
                const currentUser = await User.findById(userId)
                currentUser.followCount--
                await currentUser.save()
                res.status(200).json({ msg: '取消关注成功' })
            } else {
                res.status(401).json({ msg: '你未关注过该用户' })
            }
        }).catch((err) => {
            console.log(err)
            res.status(401).json({ msg: '用户不存在' })
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: '取消关注失败' })
    }
}
// 关注列表
exports.followList = async (req, res) => {
    try {
        // 有searchId则查具体用户的列表
        const { searchId } = req.body

        if (!searchId && !req.user) {
            return res.status(401).json({ msg: '未登录，searchId为必填' })
        }
        // 无searchId则查自己的关注列表
        const userId = searchId || req.user.userInfo._id
        let list = await Follow.find({
            userId: userId
        }).populate('followId')
        list = list.map(item => {
            return lodash.pick(item.followId, [
                '_id',
                'name',
                'fansCount',
                'followCount',
                'cover',
            ])
        })
        res.status(200).json({ list })
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
}
// 粉丝列表
exports.fansList = async (req, res) => {
    try {
        // 有searchId则查具体用户的列表
        const { searchId } = req.body
        if (!searchId && !req.user) {
            return res.status(401).json({ msg: '未登录，searchId为必填' })
        }
        // 无searchId则查自己的关注列表
        const followId = searchId || req.user.userInfo._id
        let list = await Follow.find({
            followId
        }).populate('userId')
        console.log(list)
        list = list.map(item => {
            return lodash.pick(item.userId, [
                '_id',
                'name',
                'fansCount',
                'followCount',
                'cover',
            ])
        })
        res.status(200).json({ list })
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
}
exports.template = async (req, res) => {
    try {

    } catch (e) {
        // res.status(500).json({ msg: e })
    }
}