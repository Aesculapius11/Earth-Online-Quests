import axios from 'axios';

// 用你的服务器IP替换下面的 192.168.1.100
const instance = axios.create({
  baseURL: 'https://api.antares.xin:2053/api',
  timeout: 5000
});

export default instance;