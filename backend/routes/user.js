const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 注册接口
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 检查用户名是否已存在
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).json({ msg: '用户名已存在' });
    }
    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);
    // 创建用户
    const user = new User({ username, password: hashPwd });
    await user.save();
    res.json({ msg: '注册成功' });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: '用户名或密码错误' });
    }
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '用户名或密码错误' });
    }
    // 生成JWT
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

// 获取用户信息（需要token）
router.get('/me', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: '未登录' });
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: 'token无效' });
  }
});

module.exports = router;