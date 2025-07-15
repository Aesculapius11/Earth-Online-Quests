const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// 中间件：验证token
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: '未登录' });
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token无效' });
  }
}

// 新建任务
router.post('/', auth, async (req, res) => {
  const { title, description, type, startTime, deadline } = req.body;
  try {
    const task = new Task({
      userId: req.userId,
      title,
      description,
      type,
      startTime,
      deadline,
      status: '未完成'
    });
    await task.save();
    res.json({ msg: '任务创建成功', task });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

// 获取当前用户所有任务
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ startTime: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

// 修改任务
router.put('/:id', auth, async (req, res) => {
  const { title, description, type, startTime, deadline, status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, type, startTime, deadline, status },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: '任务不存在' });
    res.json({ msg: '任务更新成功', task });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

// 删除任务
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ msg: '任务不存在' });
    res.json({ msg: '任务已删除' });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

module.exports = router;