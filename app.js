const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router');

app.use(express.json()); // 支持数据json
app.use(express.urlencoded());
app.use(cors()); // 支持跨域
app.use(morgan('dev')); // 支持日志记录
app.use('/api/v1', router); // 若请求路径为/api/v1则到router处理

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
