'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface TicketRow {
  key: string;
  ticketId: string;
  subject: string;
  priority: string;
  owner: string;
}

const priorityOptions = ['Low', 'Medium', 'High'];
const REFERENCE_PRIORITY = 'High';

const initialData: TicketRow[] = [
  { key: '1', ticketId: 'TCK-1019', subject: 'Login timeout issue', priority: 'Medium', owner: 'Dana Kim' },
  { key: '2', ticketId: 'TCK-1020', subject: 'Dashboard slow load', priority: 'Low', owner: 'Alex Chen' },
  { key: '3', ticketId: 'TCK-1021', subject: 'API rate limit errors', priority: 'Low', owner: 'Jordan Lee' },
  { key: '4', ticketId: 'TCK-1022', subject: 'PDF export broken', priority: 'High', owner: 'Priya Shah' },
  { key: '5', ticketId: 'TCK-1023', subject: 'Email notifications delayed', priority: 'Medium', owner: 'Mina Ortiz' },
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<TicketRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: TicketRow) => r.key === editingKey;
  const edit = (r: TicketRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.ticketId === 'TCK-1021');
    if (row && row.priority === REFERENCE_PRIORITY && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const columns = [
    { title: 'Ticket ID', dataIndex: 'ticketId', width: 100 },
    { title: 'Subject', dataIndex: 'subject', width: 200 },
    {
      title: 'Priority', dataIndex: 'priority', width: 110,
      render: (_: string, r: TicketRow) => isEditing(r)
        ? <Form.Item name="priority" style={{ margin: 0 }}><Select size="small" options={priorityOptions.map((p) => ({ value: p, label: p }))} /></Form.Item>
        : <Tag color={r.priority === 'High' ? 'red' : r.priority === 'Medium' ? 'orange' : 'default'}>{r.priority}</Tag>,
    },
    { title: 'Owner', dataIndex: 'owner', width: 120 },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: TicketRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', gap: 16 }}>
      <Card size="small" title="Reference" style={{ width: 180 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Target priority:</Text>
        <Tag data-testid="priority-reference" color="red" style={{ fontSize: 14 }}>{REFERENCE_PRIORITY}</Tag>
      </Card>
      <Card size="small" title="Support tickets" style={{ flex: 1, maxWidth: 700 }}>
        <Form form={form} component={false}>
          <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
        </Form>
      </Card>
    </div>
  );
}
