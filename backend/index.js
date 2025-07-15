const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
connectDB();

app.use(cors({
  origin: 'https://earthonline.antares.xin',
  credentials: true,
}));

// 预检请求支持（推荐用正则）
app.options(/.*/, cors({
  origin: 'https://earthonline.antares.xin',
  credentials: true,
}));

app.use(express.json());

app.use('/api/user', require('./routes/user'));
app.use('/api/task', require('./routes/task'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`后端服务已启动，端口：${PORT}`);
});