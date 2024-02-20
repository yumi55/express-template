const { Blog, Like } = require('../model/index')
const lodash = require('lodash')
exports.add = async (req, res) => {
    try {
        const add = req.body
        add.user = req.user.userInfo._id
        const blogModel = new Blog(add)
        const dbBack = await blogModel.save()
        res.status(200).json({ dbBack })
    } catch (e) {
        res.status(500).json({ msg: e })
    }
}
exports.list = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10 } = req.body
        const list = await Blog.find()
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ updateAt: -1 })
            .populate('user', '_id name');
        const total = await Blog.countDocuments() //  获取list总数
        res.status(200).json({ list, total })
    } catch (e) {
        res.status(500).json({ msg: e })
    }
}
exports.detail = async (req, res) => {
    try {
        const { id: blogId } = req.params
        const dbBack = await Blog
            .findById(blogId)
            .populate('user', '_id name')
        if (req.user) {
            // 判断是否有点赞该博客
            const userId = req.user.userInfo._id
            const record = await Like.findOne({
                userId,
                blogId
            })
            dbBack.isLike = !!record
        }
        const data = lodash.pick(dbBack, [
            '_id',
            'name',
            'title',
            'content',
            'cover',
            'isLike'
        ])
        if (!data.isLike) {
            data.isLike = false
        }
        res.status(200).json({ data })
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
}
exports.template = async (req, res) => {
    try {
        // res.status(200).json({ dbBack })
    } catch (e) {
        // res.status(500).json({ msg: e })
    }
}
