import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Form, Input, DatePicker, Select, message, Tag, List, Modal } from 'antd';
import dayjs from 'dayjs';
import request from '../utils/request';

const { Option } = Select;

const TASK_TYPES = ['主线', '支线', '副本'];

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // 获取任务列表
  const fetchTasks = async () => {
    try {
      const res = await request.get('/task', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setTasks(res.data);
    } catch (err) {
      message.error('获取任务失败，请重新登录');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 新建或编辑任务
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        startTime: values.startTime.toISOString(),
        deadline: values.deadline.toISOString(),
      };
      if (editingTask) {
        await request.put(`/task/${editingTask._id}`, data, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        message.success('任务更新成功');
      } else {
        await request.post('/task', data, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        message.success('任务创建成功');
      }
      form.resetFields();
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      message.error('操作失败');
    }
    setLoading(false);
  };

  // 删除任务
  const deleteTask = async (id) => {
    Modal.confirm({
      title: '确认删除该任务？',
      onOk: async () => {
        try {
          await request.delete(`/task/${id}`, {
            headers: { Authorization: localStorage.getItem('token') }
          });
          message.success('任务已删除');
          fetchTasks();
        } catch {
          message.error('删除失败');
        }
      }
    });
  };

  // 编辑任务
  const editTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      startTime: dayjs(task.startTime),
      deadline: dayjs(task.deadline),
    });
  };

  // 任务状态切换
  const toggleStatus = async (task) => {
    try {
      await request.put(`/task/${task._id}`, {
        ...task,
        status: task.status === '完成' ? '未完成' : '完成',
        startTime: task.startTime,
        deadline: task.deadline,
      }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchTasks();
    } catch {
      message.error('状态切换失败');
    }
  };

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="responsive-container">
      <Card
        title="任务管理"
        extra={<Button onClick={logout}>退出登录</Button>}
        style={{
          width: '100%',
          maxWidth: 700,
          margin: '0 auto 24px auto',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          background: 'rgba(34,34,34,0.95)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: '主线' }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
        >
          <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入任务标题' }]} style={{ maxWidth: 220 }}>
            <Input.TextArea placeholder="在此处输入任务标题" style={{ minHeight: 40 }} />
          </Form.Item>
          <Form.Item name="description" label="描述" style={{ maxWidth: 220 }}>
            <Input.TextArea placeholder="在此处输入任务描述" style={{ minHeight: 40 }} />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]} style={{ maxWidth: 220 }}>
            <Select style={{ height: 40 }} dropdownStyle={{ fontSize: '1rem' }}>
              {TASK_TYPES.map(type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]} style={{ maxWidth: 220 }}>
            <DatePicker showTime placeholder="开始时间" style={{ height: 40, width: '100%' }} inputReadOnly={true} />
          </Form.Item>
          <Form.Item name="deadline" label="截止时间" rules={[{ required: true, message: '请选择截止时间' }]} style={{ maxWidth: 220 }}>
            <DatePicker showTime placeholder="截止时间" style={{ height: 40, width: '100%' }} inputReadOnly={true} />
          </Form.Item>
          <Form.Item style={{ alignSelf: 'end', maxWidth: 220 }}>
            <Button type="primary" htmlType="submit" loading={loading} style={{ height: 40, width: '100%' }}>
              {editingTask ? '更新任务' : '新建任务'}
            </Button>
          </Form.Item>
          {editingTask && (
            <Form.Item style={{ alignSelf: 'end', maxWidth: 220 }}>
              <Button onClick={() => { setEditingTask(null); form.resetFields(); }} style={{ height: 40, width: '100%' }}>取消编辑</Button>
            </Form.Item>
          )}
        </Form>
      </Card>

      <Card
        title="任务列表"
        style={{
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          background: 'rgba(34,34,34,0.95)'
        }}
      >
        <List
          dataSource={tasks}
          renderItem={task => (
            <List.Item
              actions={[
                <Button size="small" onClick={() => toggleStatus(task)}>
                  {task.status === '完成' ? '标为未完成' : '标为完成'}
                </Button>,
                <Button size="small" onClick={() => editTask(task)}>编辑</Button>,
                <Button size="small" danger onClick={() => deleteTask(task._id)}>删除</Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <>
                    <Tag color={task.type === '主线' ? 'blue' : task.type === '支线' ? 'green' : 'purple'}>
                      {task.type}
                    </Tag>
                    <span style={{ marginLeft: 8 }}>{task.title}</span>
                  </>
                }
                description={
                  <>
                    <div>描述：{task.description}</div>
                    <div>开始：{dayjs(task.startTime).format('YYYY-MM-DD HH:mm')}</div>
                    <div>截止：{dayjs(task.deadline).format('YYYY-MM-DD HH:mm')}</div>
                    <div>状态：<Tag color={task.status === '完成' ? 'gold' : 'default'}>{task.status}</Tag></div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}