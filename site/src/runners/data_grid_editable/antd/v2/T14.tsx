'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, Select, Card, Button, Drawer, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface VendorRow {
  key: string;
  vendorId: string;
  name: string;
  tier: string;
  status: string;
}

const tierOptions = ['Bronze', 'Silver', 'Gold', 'Platinum'];
const statusOptions = ['Active', 'Pending', 'Suspended', 'Archived'];

const initialData: VendorRow[] = [
  { key: '1', vendorId: 'V-301', name: 'Acme Supplies', tier: 'Silver', status: 'Active' },
  { key: '2', vendorId: 'V-302', name: 'Globex Parts', tier: 'Gold', status: 'Active' },
  { key: '3', vendorId: 'V-303', name: 'Stark Materials', tier: 'Bronze', status: 'Pending' },
  { key: '4', vendorId: 'V-304', name: 'Wayne Logistics', tier: 'Platinum', status: 'Active' },
];

let nextKey = 10;

export default function T14({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState<VendorRow[]>(initialData);
  const [committed, setCommitted] = useState<VendorRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: VendorRow) => r.key === editingKey;

  const addVendor = () => {
    const newKey = String(nextKey++);
    const newRow: VendorRow = { key: newKey, vendorId: '', name: '', tier: 'Bronze', status: 'Active' };
    setData([newRow, ...data]);
    form.setFieldsValue({ ...newRow });
    setEditingKey(newKey);
  };

  const cancel = () => {
    const row = data.find((r) => r.key === editingKey);
    if (row && !row.vendorId) {
      setData(data.filter((r) => r.key !== editingKey));
    }
    setEditingKey('');
  };

  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  const handleApply = () => { setCommitted([...data]); setDrawerOpen(false); };

  useEffect(() => {
    if (successFired.current) return;
    const row = committed.find((r) => r.vendorId === 'V-311');
    if (row && row.name.trim() === 'Nova Supplies' && row.tier === 'Gold' && row.status === 'Pending' && !drawerOpen) {
      successFired.current = true; onSuccess();
    }
  }, [committed, drawerOpen, onSuccess]);

  const columns = [
    {
      title: 'Vendor ID', dataIndex: 'vendorId', width: 100,
      render: (_: string, r: VendorRow) => isEditing(r)
        ? <Form.Item name="vendorId" style={{ margin: 0 }}><Input size="small" /></Form.Item> : r.vendorId,
    },
    {
      title: 'Name', dataIndex: 'name', width: 160,
      render: (_: string, r: VendorRow) => isEditing(r)
        ? <Form.Item name="name" style={{ margin: 0 }}><Input size="small" /></Form.Item> : r.name,
    },
    {
      title: 'Tier', dataIndex: 'tier', width: 100,
      render: (_: string, r: VendorRow) => isEditing(r)
        ? <Form.Item name="tier" style={{ margin: 0 }}><Select size="small" options={tierOptions.map((t) => ({ value: t, label: t }))} /></Form.Item>
        : <Tag>{r.tier}</Tag>,
    },
    {
      title: 'Status', dataIndex: 'status', width: 100,
      render: (_: string, r: VendorRow) => isEditing(r)
        ? <Form.Item name="status" style={{ margin: 0 }}><Select size="small" options={statusOptions.map((s) => ({ value: s, label: s }))} /></Form.Item>
        : <Tag>{r.status}</Tag>,
    },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: VendorRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => { form.setFieldsValue({ ...r }); setEditingKey(r.key); }}>Edit</Button>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card size="small" style={{ maxWidth: 400, marginBottom: 16 }}>
        <Text>Vendor management settings</Text>
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>Manage vendors</Button>
        </div>
      </Card>
      <Drawer
        title="Vendors"
        open={drawerOpen}
        onClose={() => { setData([...committed]); setEditingKey(''); setDrawerOpen(false); }}
        width={680}
        footer={<Space><Button onClick={() => { setData([...committed]); setEditingKey(''); setDrawerOpen(false); }}>Cancel</Button><Button type="primary" onClick={handleApply}>Apply vendor changes</Button></Space>}
      >
        <Space style={{ marginBottom: 8 }}>
          <Button size="small" type="primary" onClick={addVendor} disabled={editingKey !== ''}>Add vendor</Button>
          <Button size="small" disabled>Import</Button>
          <Button size="small" disabled>Archive</Button>
        </Space>
        <Form form={form} component={false}>
          <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
        </Form>
      </Drawer>
    </div>
  );
}
