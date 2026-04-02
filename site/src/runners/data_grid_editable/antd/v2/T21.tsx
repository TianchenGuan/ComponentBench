'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface OrderRow { key: string; orderId: string; product: string; status: string; amount: number; }
interface ReturnRow { key: string; returnId: string; reason: string; status: string; refund: number; }

const orderStatusOpts = ['New', 'Processing', 'Shipped', 'Cancelled'];
const returnStatusOpts = ['Requested', 'Under review', 'Approved', 'Denied'];

const ordersData: OrderRow[] = [
  { key: 'o1', orderId: 'ORD-3001', product: 'Widget A', status: 'Processing', amount: 120 },
  { key: 'o2', orderId: 'ORD-3002', product: 'Widget B', status: 'New', amount: 85 },
  { key: 'o3', orderId: 'ORD-3003', product: 'Widget C', status: 'Shipped', amount: 200 },
  { key: 'o4', orderId: 'ORD-3004', product: 'Widget D', status: 'New', amount: 50 },
];

const returnsInitial: ReturnRow[] = [
  { key: 'r1', returnId: 'RET-1001', reason: 'Defective item', status: 'Requested', refund: 85 },
  { key: 'r2', returnId: 'RET-1002', reason: 'Wrong size', status: 'Under review', refund: 120 },
  { key: 'r3', returnId: 'RET-1003', reason: 'Changed mind', status: 'Denied', refund: 45 },
  { key: 'r4', returnId: 'RET-1004', reason: 'Late delivery', status: 'Requested', refund: 200 },
];

export default function T21({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [returns, setReturns] = useState<ReturnRow[]>(returnsInitial);
  const [returnsCommitted, setReturnsCommitted] = useState<ReturnRow[]>(returnsInitial);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: ReturnRow) => r.key === editingKey;
  const edit = (r: ReturnRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...returns]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setReturns(d); setEditingKey('');
  };

  const applyReturns = () => { setReturnsCommitted([...returns]); };

  useEffect(() => {
    if (successFired.current) return;
    const row = returnsCommitted.find((r) => r.returnId === 'RET-1002');
    if (row && row.status === 'Approved') { successFired.current = true; onSuccess(); }
  }, [returnsCommitted, onSuccess]);

  const orderCols = [
    { title: 'Order ID', dataIndex: 'orderId', width: 100 },
    { title: 'Product', dataIndex: 'product', width: 120 },
    { title: 'Status', dataIndex: 'status', width: 100, render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Amount', dataIndex: 'amount', width: 90, render: (v: number) => `$${v}` },
  ];

  const returnCols = [
    { title: 'Return ID', dataIndex: 'returnId', width: 100 },
    { title: 'Reason', dataIndex: 'reason', width: 140 },
    {
      title: 'Status', dataIndex: 'status', width: 120,
      render: (_: string, r: ReturnRow) => isEditing(r)
        ? <Form.Item name="status" style={{ margin: 0 }}><Select size="small" options={returnStatusOpts.map((s) => ({ value: s, label: s }))} /></Form.Item>
        : <Tag>{r.status}</Tag>,
    },
    { title: 'Refund', dataIndex: 'refund', width: 80, render: (v: number) => `$${v}` },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: ReturnRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}><Tag color="blue">Operations</Tag><Text type="secondary">Dashboard overview</Text></Space>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card size="small" title="Orders" style={{ flex: 1 }}>
          <Table dataSource={ordersData} columns={orderCols as any} pagination={false} size="small" bordered />
          <Button size="small" style={{ marginTop: 8 }} disabled>Apply orders changes</Button>
        </Card>
        <Card size="small" title="Returns" style={{ flex: 1 }}>
          <Form form={form} component={false}>
            <Table dataSource={returns} columns={returnCols as any} pagination={false} size="small" bordered />
          </Form>
          <Button size="small" type="primary" style={{ marginTop: 8 }} onClick={applyReturns}>Apply returns changes</Button>
        </Card>
      </div>
    </div>
  );
}
