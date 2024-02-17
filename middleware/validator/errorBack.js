const { validationResult } = require('express-validator')

module.exports = validator => {
    return async (req, res, next) => {
        await Promise.all(validator.map((validate) => validate.run(req)))
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const arr = errors.array()
            const errorTips = []
            arr.forEach((err) => {
                errorTips.push(err.msg)
            })
            return res.status(401).json({ error: errorTips.join(';') })
        }
        next()
    }
}