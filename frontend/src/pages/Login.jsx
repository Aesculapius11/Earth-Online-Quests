import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import request from '../utils/request'; // 用自定义的 axios 实例
import { Form, Input, Button, message, Card } from 'antd';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await request.post('/user/login', values); // 只写相对路径
      localStorage.setItem('token', res.data.token);
      message.success('登录成功');
      navigate('/tasks');
    } catch (err) {
      message.error(err.response?.data?.msg || '登录失败');
    }
    setLoading(false);
  };

  return (
    <div className="responsive-container">
      <Card
        title="Earth Online Quests 登录"
        style={{
          width: '100%',
          maxWidth: 400,
          margin: '0 auto',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          background: 'rgba(34,34,34,0.95)'
        }}
      >
        <Form onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
          <Form.Item>
            没有账号？<Link to="/register">注册</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}