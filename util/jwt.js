const jwt = require("jsonwebtoken")
// jwt跨域认证的解决方案，返回头部.负载.签名
const { promisify } = require("util")
const toJwt = promisify(jwt.sign)
const verify = promisify(jwt.verify)
const { uuid } = require('../config/config.default')
module.exports.createToken = async userInfo => {
    return toJwt(
        { userInfo },
        uuid,
        {
            expiresIn: 60 * 60 * 24 // 24h
        }
    )
}

module.exports.verifyToken = (require = true) => {
    return async (req, res, next) => {
        let token = req.headers.authorization
        token = token ? token.split("Bearer ")[1] : null
        if (token) {
            try {
                const userInfo = await verify(token, uuid)
                req.user = userInfo // 中间件直接改了req，后面的请求的req也可以获取userInfo信息
                next()
            } catch (err) {
                res.status(402).json({ error: "token失效，请重新登录！" })
            }
        } else if (require) {
            res.status(402).json({ error: "请先登录！" })
        } else {
            next()
        }
    }
}