const { User } = require('../model/index')
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
    const id = req.userInfo.userInfo._id
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
        const id = req.userInfo.userInfo._id
        await User.findByIdAndUpdate(id, {
            image: filename + '.' + suffix
        }, { new: true })
        res.status(200).json({ filePath: filename + '.' + suffix })

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: error })
    }
}
exports.list = (req, res) => {
    res.send('list-user');
};
exports.delete = (req, res) => {
    res.send('delete-user');
};
