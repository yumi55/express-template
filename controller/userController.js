const { User } = require('../model/index')
exports.register = async (req, res) => {
    const userModel = new User(req.body)
    const dbBack = await userModel.save()
    const user = dbBack.toJSON()
    delete user.password
    res.status(201).json({
        user
    })
};
// 用户登录
exports.login = async (req, res) => {
    // 客户端数据验证
    // 链接数据库查询
    var dbBack = await User.findOne(req.body)
    if (!dbBack) {
        res.status(402).json({ error: "邮箱或者密码不正确" })
    }
    // dbBack = dbBack.toJSON()
    res.status(200).json(dbBack)
}
exports.list = (req, res) => {
    res.send('list-user');
};
exports.delete = (req, res) => {
    res.send('delete-user');
};
