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
    .put('/', verifyToken, userController.update) // 更新用户信息
    .post('/headimg', verifyToken, upload.single('headimg'), userController.headimg) // 上传用户头像 //post 传key=headimg的file，则可以通过req.file获取
    .get('/lists', verifyToken, userController.list) // 获取列表
    .delete('/deletes', verifyToken, userController.delete); // 删除

module.exports = router;
