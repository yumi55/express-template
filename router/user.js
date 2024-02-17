const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const validator = require('../middleware/validator/userValidator')
router
    .post('/registers', validator.register, userController.register) // 注册
    .get('/logins', validator.login, userController.login) // 登录列表
    .get('/lists', userController.list) // 获取列表
    .delete('/deletes', userController.delete); // 删除

module.exports = router;
