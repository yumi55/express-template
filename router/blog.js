const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const blogValidator = require('../middleware/validator/blogValidator')
const { verifyToken } = require('../util/jwt')
router
    .post('/', verifyToken, blogValidator.add, blogController.add)
    .get('/list', (req, res) => {
        res.send('list');
    })

module.exports = router;
