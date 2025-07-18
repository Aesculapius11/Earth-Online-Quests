import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'; // AntD 5.x 必须引入reset.css，否则Modal等弹窗不显示
import './App.css'
// import './index.css' // 暂时注释掉 index.css，避免样式冲突
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
