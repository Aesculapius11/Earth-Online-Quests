const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://8.137.70.233:27017/earth_online_quests', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB 连接成功');
  } catch (err) {
    console.error('MongoDB 连接失败', err);
    process.exit(1);
  }
};

module.exports = connectDB;