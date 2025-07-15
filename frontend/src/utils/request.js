import axios from 'axios';

// 用你的服务器IP替换下面的 192.168.1.100
const instance = axios.create({
  baseURL: 'http://192.168.31.127:3001/api',
  timeout: 5000
});

export default instance;