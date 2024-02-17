const express = require('express');
const router = express.Router();

router.get('/lists', (req, res) => {
    res.send('video-list');
});

module.exports = router;
