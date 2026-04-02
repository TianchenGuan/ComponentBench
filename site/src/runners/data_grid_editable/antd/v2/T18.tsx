'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, Select, Card, Button, Modal, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface BacklogRow {
  key: string;
  itemId: string;
  title: string;
  owner: string;
  priority: string;
}

const priorityOptions = ['Low', 'Medium', 'High'];

const initialData: BacklogRow[] = [
  { key: '1', itemId: 'BL-50', title: 'Update API docs', owner: 'Dana Kim', priority: 'Low' },
  { key: '2', itemId: 'BL-51', title: 'Fix login timeout', owner: 'Alex Chen', priority: 'Medium' },
  { key: '3', itemId: 'BL-52', title: 'Add rate limiting', owner: 'Jordan Lee', priority: 'Low' },
  { key: '4', itemId: 'BL-53', title: 'Refactor auth module', owner: 'Backend', priority: 'Medium' },
  { key: '5', itemId: 'BL-54', title: 'Dashboard redesign', owner: 'Priya Shah', priority: 'Low' },
  { key: '6', itemId: 'BL-55', title: 'DB migration v3', owner: 'Liam Torres', priority: 'High' },
];

export default function T18({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<BacklogRow[]>(initialData);
  const [committed, setCommitted] = useState<BacklogRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: BacklogRow) => r.key === editingKey;
  const edit = (r: BacklogRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  const handleApply = () => { setCommitted([...data]); setModalOpen(false); };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.itemId === 'BL-53');
    if (row && row.owner.trim() === 'Platform' && row.priority === 'High' && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const columns = [
    { title: 'Item ID', dataIndex: 'itemId', width: 90 },
    { title: 'Title', dataIndex: 'title', width: 180 },
    {
      title: 'Owner', dataIndex: 'owner', width: 130,
      render: (_: string, r: BacklogRow) => isEditing(r)
        ? <Form.Item name="owner" style={{ margin: 0 }}><Input size="small" /></Form.Item> : r.owner,
    },
    {
      title: 'Priority', dataIndex: 'priority', width: 100,
      render: (_: string, r: BacklogRow) => isEditing(r)
        ? <Form.Item name="priority" style={{ margin: 0 }}><Select size="small" options={priorityOptions.map((p) => ({ value: p, label: p }))} /></Form.Item>
        : <Tag color={r.priority === 'High' ? 'red' : r.priority === 'Medium' ? 'orange' : 'default'}>{r.priority}</Tag>,
    },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: BacklogRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: 24, color: '#fff' }}>
      <Card style={{ background: '#1f1f1f', borderColor: '#333', maxWidth: 400, marginBottom: 16 }}>
        <Text style={{ color: '#aaa' }}>Backlog management</Text>
        <div style={{ marginTop: 12 }}><Button type="primary" onClick={() => setModalOpen(true)}>Edit backlog</Button></div>
      </Card>
      <Modal title="Edit backlog" open={modalOpen} onCancel={() => { setData([...committed]); setEditingKey(''); setModalOpen(false); }}
        footer={<Space><Button onClick={() => { setData([...committed]); setEditingKey(''); setModalOpen(false); }}>Cancel</Button><Button type="primary" onClick={handleApply}>Apply backlog changes</Button></Space>}
        width={720}>
        <Space style={{ marginBottom: 8 }}><Text type="secondary">6 items • 2 high priority</Text></Space>
        <Form form={form} component={false}>
          <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
        </Form>
      </Modal>
    </div>
  );
}
