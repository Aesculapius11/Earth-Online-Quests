import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message, Card } from 'antd';
import request from '../utils/request';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await request.post('/user/register', values);
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (err) {
      message.error(err.response?.data?.msg || '注册失败');
    }
    setLoading(false);
  };

  return (
    <div className="responsive-container">
      <Card
        title="Earth Online Quests 注册"
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
              注册
            </Button>
          </Form.Item>
          <Form.Item>
            已有账号？<Link to="/login">登录</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}