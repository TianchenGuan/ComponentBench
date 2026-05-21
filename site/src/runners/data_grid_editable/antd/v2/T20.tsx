'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, InputNumber, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface SlaRow {
  key: string;
  policyId: string;
  name: string;
  slaMinutes: number;
  grace: number;
  cap: number;
  retries: number;
}

const initialData: SlaRow[] = Array.from({ length: 8 }, (_, i) => ({
  key: String(i),
  policyId: `SLA-${10 + i}`,
  name: `Policy ${10 + i}`,
  slaMinutes: [30, 60, 15, 90, 45, 120, 20, 75][i],
  grace: [5, 10, 3, 15, 7, 20, 5, 12][i],
  cap: [100, 200, 50, 300, 150, 400, 80, 250][i],
  retries: [3, 5, 2, 7, 4, 6, 3, 5][i],
}));
initialData[4].slaMinutes = 30;

export default function T20({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<SlaRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: SlaRow) => r.key === editingKey;
  const edit = (r: SlaRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.policyId === 'SLA-14');
    if (row && row.slaMinutes === 45 && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const numCol = (title: string, dataIndex: string) => ({
    title, dataIndex, width: 120,
    render: (_: number, r: SlaRow) => isEditing(r)
      ? <Form.Item name={dataIndex} style={{ margin: 0 }}><InputNumber size="small" min={0} /></Form.Item>
      : (r as any)[dataIndex],
  });

  const columns = [
    { title: 'Policy ID', dataIndex: 'policyId', width: 90, fixed: 'left' as const },
    { title: 'Name', dataIndex: 'name', width: 120 },
    numCol('SLA minutes', 'slaMinutes'),
    numCol('Grace', 'grace'),
    numCol('Cap', 'cap'),
    numCol('Retries', 'retries'),
    {
      title: 'Actions', width: 130, fixed: 'right' as const,
      render: (_: unknown, r: SlaRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: 24, color: '#fff' }}>
      <Space style={{ marginBottom: 12 }}>
        <Tag style={{ background: '#ff0', color: '#000', fontWeight: 'bold' }}>SLA Dashboard</Tag>
        <Text style={{ color: '#fff' }}>High-contrast mode</Text>
      </Space>
      <Card size="small" title="SLA policies"
        style={{ width: 600, background: '#111', borderColor: '#fff', color: '#fff' }}
        styles={{ header: { color: '#fff', borderBottom: '1px solid #fff' } }}>
        <Form form={form} component={false}>
          <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered scroll={{ x: 850 }} />
        </Form>
      </Card>
    </div>
  );
}
