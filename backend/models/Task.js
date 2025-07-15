const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true }, // 主线/支线/副本/自定义
  startTime: { type: Date, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['完成', '未完成'], default: '未完成' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);