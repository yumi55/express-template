const { Blog } = require('../model/index')
exports.add = async (req, res) => {
    try {
        const add = req.body
        add.user = req.userInfo.userInfo._id
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
        const { id } = req.params
        const dbBack = await Blog
            .findById(id)
            .populate('user', '_id name')
        res.status(200).json({ data: dbBack })
    } catch (e) {
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
