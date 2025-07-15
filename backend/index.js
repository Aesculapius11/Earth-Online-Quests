const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// 用户相关路由
app.use('/api/user', require('./routes/user'));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`后端服务已启动，端口：${PORT}`);
});

app.use('/api/task', require('./routes/task'));