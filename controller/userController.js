const { User } = require('../model/index')
const { createToken } = require('../util/jwt')
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
    let userinfo = await User.findOne(req.body)
    if (!userinfo) {
        return res.status(401).json({ msg: '邮箱或密码错误！' })
    }
    userinfo = userinfo.toJSON()
    userinfo.token = await createToken(userinfo)
    res.status(200).json(userinfo)
}
exports.list = (req, res) => {
    res.send('list-user');
};
exports.delete = (req, res) => {
    res.send('delete-user');
};
