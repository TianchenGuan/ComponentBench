'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface EmployeeRow {
  key: string;
  empId: string;
  name: string;
  role: string;
  region: string;
}

const roleOptions = ['Staff', 'Manager', 'Director', 'Lead'];
const regionOptions = ['North', 'South', 'East', 'West'];

const initialData: EmployeeRow[] = [
  { key: '1', empId: 'EMP-42', name: 'Dana Kim', role: 'Lead', region: 'North' },
  { key: '2', empId: 'EMP-43', name: 'Alex Chen', role: 'Manager', region: 'East' },
  { key: '3', empId: 'EMP-44', name: 'Jordan Lee', role: 'Staff', region: 'West' },
  { key: '4', empId: 'EMP-45', name: 'Jordan Li', role: 'Staff', region: 'East' },
  { key: '5', empId: 'EMP-46', name: 'Priya Shah', role: 'Director', region: 'South' },
  { key: '6', empId: 'EMP-47', name: 'Mina Ortiz', role: 'Manager', region: 'West' },
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<EmployeeRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [cancelledKey, setCancelledKey] = useState<string | null>(null);

  const isEditing = (r: EmployeeRow) => r.key === editingKey;
  const edit = (r: EmployeeRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };

  const cancel = (key: string) => {
    setEditingKey('');
    setCancelledKey(key);
  };

  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    if (cancelledKey !== '3') return;
    const row = data.find((r) => r.empId === 'EMP-44');
    if (row && row.role === 'Staff' && row.region === 'West' && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, cancelledKey, onSuccess]);

  const columns = [
    { title: 'Employee ID', dataIndex: 'empId', width: 100 },
    { title: 'Name', dataIndex: 'name', width: 130 },
    {
      title: 'Role', dataIndex: 'role', width: 110,
      render: (_: string, r: EmployeeRow) => isEditing(r)
        ? <Form.Item name="role" style={{ margin: 0 }}><Select size="small" options={roleOptions.map((o) => ({ value: o, label: o }))} /></Form.Item>
        : <Tag>{r.role}</Tag>,
    },
    {
      title: 'Region', dataIndex: 'region', width: 100,
      render: (_: string, r: EmployeeRow) => isEditing(r)
        ? <Form.Item name="region" style={{ margin: 0 }}><Select size="small" options={regionOptions.map((o) => ({ value: o, label: o }))} /></Form.Item>
        : <Tag>{r.region}</Tag>,
    },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: EmployeeRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={() => cancel(r.key)}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: 24, color: '#fff' }}>
      <Space style={{ marginBottom: 12 }}>
        <Tag color="purple">HR</Tag><Tag>6 employees</Tag>
        <Text style={{ color: '#aaa' }}>Status pills: 2 pending, 4 active</Text>
      </Space>
      <Card size="small" title="Employees" style={{ width: 620, background: '#1f1f1f', borderColor: '#333' }}
        styles={{ header: { color: '#fff' } }}>
        <Form form={form} component={false}>
          <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
        </Form>
      </Card>
    </div>
  );
}
