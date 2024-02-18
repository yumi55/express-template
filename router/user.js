const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const userValidator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../util/jwt')
router
    .post('/registers', userValidator.register, userController.register) // 注册
    .get('/logins', userValidator.login, userController.login) // 登录列表
    .put('/', verifyToken, userController.update) // 更新用户信息
    .get('/lists', verifyToken, userController.list) // 获取列表
    .delete('/deletes', verifyToken, userController.delete); // 删除

module.exports = router;
