const { body } = require('express-validator')
const { User } = require('../../model/index')
const validator = require('./errorBack')
// notEmpty isLength isEmail custom 
// 校验唯一性：custom方法内 引入连接数据库的具体user，通过fineone({name:val})
// bail只对当前name中的多个校验中，若前者校验错误则中断，会继续校验下个字段
module.exports.register = validator([
    body('name')
        .notEmpty().withMessage('name is empty').bail()
        .isLength({ min: 3 }).withMessage('minLength is 3').bail(),
    body('email')
        .notEmpty().withMessage('email is empty').bail()
        .isEmail().withMessage('email format is error').bail()
        .custom(async val => {
            const emailValidate = await User.findOne({ email: val })
            if (emailValidate) {
                return Promise.reject('the email has been registered')
            }
        }).bail(),
    body('password')
        .notEmpty().withMessage('密码不能为空').bail()
        .isLength({ min: 5 }).withMessage('用户名长度不能小于5').bail(),
])
// 登录
module.exports.login = validator([
    body('email')
        .notEmpty().withMessage('email is empty').bail()
        .isEmail().withMessage('email format is error').bail()
        .custom(async val => {
            const emailValidate = await User.findOne({ email: val })
            if (!emailValidate) {
                return Promise.reject('the email not register')
            }
        }).bail(),
    body('password')
        .notEmpty().withMessage('密码不能为空').bail()
])

