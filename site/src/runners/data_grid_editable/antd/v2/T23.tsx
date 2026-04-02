'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, Select, Card, Button, Dropdown, Form, Tag, Space, Typography } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface EscalationRow {
  key: string;
  escId: string;
  title: string;
  owner: string;
  status: string;
}

const statusOptions = ['Open', 'Investigating', 'Pending review', 'Resolved'];

const initialData: EscalationRow[] = [
  { key: '1', escId: 'ESC-21', title: 'SLA breach tier-1', owner: 'Dana Kim', status: 'Open' },
  { key: '2', escId: 'ESC-22', title: 'Data inconsistency', owner: 'Alex Chen', status: 'Investigating' },
  { key: '3', escId: 'ESC-23', title: 'Service degradation', owner: 'Jordan Lee', status: 'Open' },
  { key: '4', escId: 'ESC-24', title: 'Auth outage follow-up', owner: 'Priya Shah', status: 'Investigating' },
  { key: '5', escId: 'ESC-25', title: 'Billing anomaly', owner: 'Liam Torres', status: 'Open' },
  { key: '6', escId: 'ESC-26', title: 'CDN cache poisoning', owner: 'Mina Ortiz', status: 'Resolved' },
  { key: '7', escId: 'ESC-27', title: 'DB failover incident', owner: 'Sam Rivera', status: 'Investigating' },
];

export default function T23({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<EscalationRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: EscalationRow) => r.key === editingKey;

  const startEdit = (r: EscalationRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.escId === 'ESC-24');
    if (row && row.owner.trim() === 'Alex Chen' && row.status === 'Pending review' && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const columns = [
    { title: 'Escalation ID', dataIndex: 'escId', width: 110 },
    { title: 'Title', dataIndex: 'title', width: 180 },
    {
      title: 'Owner', dataIndex: 'owner', width: 130,
      render: (_: string, r: EscalationRow) => isEditing(r)
        ? <Form.Item name="owner" style={{ margin: 0 }}><Input size="small" /></Form.Item> : r.owner,
    },
    {
      title: 'Status', dataIndex: 'status', width: 130,
      render: (_: string, r: EscalationRow) => isEditing(r)
        ? <Form.Item name="status" style={{ margin: 0 }}><Select size="small" options={statusOptions.map((s) => ({ value: s, label: s }))} /></Form.Item>
        : <Tag>{r.status}</Tag>,
    },
    {
      title: 'Actions', width: 110,
      render: (_: unknown, r: EscalationRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Dropdown menu={{
            items: [
              { key: 'view', label: 'View' },
              { key: 'edit', label: 'Edit', onClick: () => startEdit(r) },
              { key: 'archive', label: 'Archive' },
            ],
          }} trigger={['click']}>
            <Button size="small" type="text" icon={<MoreOutlined />} disabled={editingKey !== ''} />
          </Dropdown>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}>
        <Tag color="red">Active escalations: 5</Tag>
        <Text type="secondary">Escalation management dashboard</Text>
      </Space>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card size="small" title="Escalations" style={{ flex: 1, maxWidth: 700 }}>
          <Form form={form} component={false}>
            <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
          </Form>
        </Card>
        <Card size="small" style={{ width: 200 }}>
          <Text strong>Summary</Text>
          <div style={{ marginTop: 8 }}><Text type="secondary">Avg resolution: 4.2h</Text></div>
          <div><Text type="secondary">SLA met: 88%</Text></div>
        </Card>
      </div>
    </div>
  );
}
