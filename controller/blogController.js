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
exports.template = async (req, res) => {
    try {
        // res.status(200).json({ dbBack })
    } catch (e) {
        // res.status(500).json({ msg: e })
    }
}
