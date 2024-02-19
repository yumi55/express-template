const { body } = require('express-validator')
const validator = require('./errorBack')
module.exports.add = validator([
    body('title')
        .notEmpty().withMessage('标题不可为空').bail(),
    body('content')
        .notEmpty().withMessage('内容不可为空').bail()
        .isLength({ min: 3 }).withMessage('内容最小长度为3').bail(),
])