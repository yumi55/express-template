const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const userValidator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../util/jwt')
const multer = require('multer') // 上传中间件
const upload = multer({ dest: 'public/' }) // 指定上传到的目的地址
router
    .post('/registers', userValidator.register, userController.register) // 注册
    .get('/logins', userValidator.login, userController.login) // 登录列表
    .put('/', verifyToken(), userController.update) // 更新用户信息
    .post('/headimg', verifyToken(), upload.single('headimg'), userController.headimg) // 上传用户头像 //post 传key=headimg的file，则可以通过req.file获取
    .get('/list', verifyToken(), userController.list) // 获取列表
    .delete('/:id', verifyToken(), userController.delete) // 删除
    .post('/like/:id', verifyToken(), userController.like) // 点赞博客
    .post('/unlike/:id', verifyToken(), userController.unlike)// 取消点赞博客
    .post('/follow/:id', verifyToken(), userController.follow) // 关注用户
    .post('/unfollow/:id', verifyToken(), userController.unfollow) // 取消关注用户
    // 看其他用户的关注列表
    // 看自己的关注列表
    .get('/follow', verifyToken(false), userController.followList) // 关注列表
    .get('/fans', verifyToken(false), userController.fansList) // 粉丝列表

module.exports = router;
