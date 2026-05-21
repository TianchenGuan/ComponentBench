'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface QueueRow {
  key: string;
  ticketId: string;
  subject: string;
  priority: string;
  assignee: string;
}

const priorityOptions = ['Low', 'Medium', 'High'];
const REFERENCE_PRIORITY = 'Medium';

const initialData: QueueRow[] = [
  { key: '1', ticketId: 'Q-69', subject: 'Stale cache on CDN', priority: 'Low', assignee: 'Dana Kim' },
  { key: '2', ticketId: 'Q-70', subject: 'SSL cert expiry warning', priority: 'High', assignee: 'Alex Chen' },
  { key: '3', ticketId: 'Q-71', subject: 'Webhook delivery failures', priority: 'Low', assignee: 'Jordan Lee' },
  { key: '4', ticketId: 'Q-72', subject: 'Dashboard latency spike', priority: 'High', assignee: 'Priya Shah' },
  { key: '5', ticketId: 'Q-73', subject: 'API deprecation notice', priority: 'Low', assignee: 'Mina Ortiz' },
  { key: '6', ticketId: 'Q-74', subject: 'Memory leak in worker', priority: 'Medium', assignee: 'Sam Rivera' },
];

export default function T22({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<QueueRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: QueueRow) => r.key === editingKey;
  const edit = (r: QueueRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.ticketId === 'Q-71');
    if (row && row.priority === REFERENCE_PRIORITY && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const columns = [
    { title: 'Ticket ID', dataIndex: 'ticketId', width: 90 },
    { title: 'Subject', dataIndex: 'subject', width: 200 },
    {
      title: 'Priority', dataIndex: 'priority', width: 100,
      render: (_: string, r: QueueRow) => isEditing(r)
        ? <Form.Item name="priority" style={{ margin: 0 }}><Select size="small" options={priorityOptions.map((p) => ({ value: p, label: p }))} /></Form.Item>
        : <Tag color={r.priority === 'High' ? 'red' : r.priority === 'Medium' ? 'orange' : 'default'}>{r.priority}</Tag>,
    },
    { title: 'Assignee', dataIndex: 'assignee', width: 120 },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: QueueRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: 24, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
      <Card size="small" title="Reference" style={{ width: 180, marginBottom: 12, background: '#1f1f1f', borderColor: '#333' }}
        styles={{ header: { color: '#fff' } }}>
        <Text style={{ color: '#aaa', display: 'block', marginBottom: 8 }}>Target priority:</Text>
        <Tag data-testid="priority-reference" color="orange" style={{ fontSize: 14 }}>{REFERENCE_PRIORITY}</Tag>
      </Card>
      <Space style={{ marginBottom: 8 }}>
        <Tag>Queue depth: 6</Tag><Tag>SLA breaches: 1</Tag><Tag color="red">Critical: 0</Tag>
      </Space>
      <Card size="small" title="Queue" style={{ width: 700, background: '#1f1f1f', borderColor: '#333' }}
        styles={{ header: { color: '#fff' } }}>
        <Form form={form} component={false}>
          <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
        </Form>
      </Card>
    </div>
  );
}
