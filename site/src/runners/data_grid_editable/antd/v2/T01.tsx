'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, InputNumber, Select, Card, Button, Drawer, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface ExceptionRow {
  key: string;
  exId: string;
  description: string;
  owner: string;
  status: string;
  amount: number;
}

const statusOptions = ['Open', 'Investigating', 'On hold', 'Resolved'];

const initialData: ExceptionRow[] = [
  { key: '1', exId: 'EX-201', description: 'Double charge on invoice #4421', owner: 'Liam Torres', status: 'Open', amount: 320 },
  { key: '2', exId: 'EX-202', description: 'Missing PO for vendor payout', owner: 'Dana Kim', status: 'Investigating', amount: 1500 },
  { key: '3', exId: 'EX-203', description: 'Tax mismatch EU region', owner: 'Jordan Lee', status: 'Open', amount: 89 },
  { key: '4', exId: 'EX-204', description: 'Late-fee dispute Q3', owner: 'Liam Torres', status: 'Investigating', amount: 450 },
  { key: '5', exId: 'EX-205', description: 'Refund pending approval', owner: 'Mina Ortiz', status: 'Resolved', amount: 210 },
  { key: '6', exId: 'EX-206', description: 'Currency rounding error', owner: 'Alex Chen', status: 'Open', amount: 12 },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState<ExceptionRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [committed, setCommitted] = useState<ExceptionRow[]>(initialData);

  const isEditing = (record: ExceptionRow) => record.key === editingKey;

  const edit = (record: ExceptionRow) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey('');

  const save = async (key: string) => {
    const row = await form.validateFields();
    const newData = [...data];
    const idx = newData.findIndex((item) => key === item.key);
    newData[idx] = { ...newData[idx], ...row };
    setData(newData);
    setEditingKey('');
  };

  const handleApply = () => {
    setCommitted([...data]);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = committed.find((r) => r.exId === 'EX-204');
    if (row && row.owner.trim() === 'Priya Shah' && row.status === 'On hold' && !drawerOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, drawerOpen, onSuccess]);

  const columns = [
    { title: 'Exception ID', dataIndex: 'exId', width: 110 },
    { title: 'Description', dataIndex: 'description', width: 220 },
    {
      title: 'Owner', dataIndex: 'owner', width: 140,
      render: (_: string, record: ExceptionRow) =>
        isEditing(record) ? (
          <Form.Item name="owner" style={{ margin: 0 }}><Input size="small" /></Form.Item>
        ) : record.owner,
    },
    {
      title: 'Status', dataIndex: 'status', width: 130,
      render: (_: string, record: ExceptionRow) =>
        isEditing(record) ? (
          <Form.Item name="status" style={{ margin: 0 }}>
            <Select size="small" options={statusOptions.map((s) => ({ value: s, label: s }))} />
          </Form.Item>
        ) : <Tag>{record.status}</Tag>,
    },
    { title: 'Amount', dataIndex: 'amount', width: 90, render: (v: number) => `$${v.toFixed(2)}` },
    {
      title: 'Actions', width: 140,
      render: (_: unknown, record: ExceptionRow) =>
        isEditing(record) ? (
          <Space size="small">
            <Button size="small" type="link" onClick={() => save(record.key)}>Save</Button>
            <Button size="small" type="link" onClick={cancel}>Cancel</Button>
          </Space>
        ) : (
          <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(record)}>Edit</Button>
        ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: 24, color: '#fff' }}>
      <Space direction="horizontal" size={16} style={{ marginBottom: 16 }}>
        <Card size="small" style={{ background: '#1f1f1f', borderColor: '#333' }}><Text style={{ color: '#aaa' }}>Open exceptions</Text><div style={{ fontSize: 20, color: '#fff' }}>14</div></Card>
        <Card size="small" style={{ background: '#1f1f1f', borderColor: '#333' }}><Text style={{ color: '#aaa' }}>Total amount</Text><div style={{ fontSize: 20, color: '#fff' }}>$12,480</div></Card>
        <Card size="small" style={{ background: '#1f1f1f', borderColor: '#333' }}><Text style={{ color: '#aaa' }}>Avg resolution</Text><div style={{ fontSize: 20, color: '#fff' }}>3.2 days</div></Card>
      </Space>

      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>Billing exceptions</Button>
      </div>

      <Drawer
        title={<Space><span>Exceptions</span><Button size="small" disabled>Export CSV</Button></Space>}
        open={drawerOpen}
        onClose={() => { setData([...committed]); setEditingKey(''); setDrawerOpen(false); }}
        width={720}
        placement="right"
        styles={{ body: { background: '#1a1a1a' } }}
        footer={
          <Space>
            <Button onClick={() => { setData([...committed]); setEditingKey(''); setDrawerOpen(false); }}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply drawer changes</Button>
          </Space>
        }
      >
        <Form form={form} component={false}>
          <Table
            dataSource={data}
            columns={columns as any}
            pagination={false}
            size="small"
            bordered
            rowClassName="editable-row"
          />
        </Form>
      </Drawer>
    </div>
  );
}
