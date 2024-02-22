const { redis } = require('./index')
const { Blog } = require('../../model/index')
exports.hotLike = async (blogId, inNum = 1) => {
    const data = await redis.zscore('blogLikes', blogId)
    if (data) {
        await redis.zincrby('blogLikes', inNum, blogId)
    } else {
        await redis.zadd('blogLikes', inNum, blogId)
    }
    return data
}
// 获取前nums的数据
exports.getHotLike = async (nums = 10) => {
    const list = await redis.zrevrange('blogLikes', 0, -1, 'withscores')
    const selectList = list.slice(0, nums * 20)
    const result = []
    for (let i = 0, len = selectList.length; i < len; i++) {
        if (i % 2 == 0) {
            let blogItem = await Blog.findById(selectList[i])
            blogItem = blogItem.toJSON()
            blogItem.likeCount = selectList[i + 1]
            result.push(blogItem)
        }
    }
    return result
}