'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, InputNumber, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface InvoiceRow {
  key: string;
  invoiceId: string;
  customer: string;
  quantity: number;
  reviewer: string;
  status: string;
}

const initialData: InvoiceRow[] = [
  { key: '1', invoiceId: 'INV-769', customer: 'Acme Corp', quantity: 5, reviewer: 'Dana Kim', status: 'Pending' },
  { key: '2', invoiceId: 'INV-770', customer: 'Globex Inc', quantity: 8, reviewer: 'Jordan Lee', status: 'Approved' },
  { key: '3', invoiceId: 'INV-771', customer: 'Globex Inc', quantity: 3, reviewer: 'Alex Chen', status: 'Pending' },
  { key: '4', invoiceId: 'INV-772', customer: 'Globex Inc', quantity: 12, reviewer: 'Mina Ortiz', status: 'Rejected' },
  { key: '5', invoiceId: 'INV-773', customer: 'Acme Corp', quantity: 1, reviewer: 'Liam Torres', status: 'Approved' },
  { key: '6', invoiceId: 'INV-774', customer: 'Stark Ltd', quantity: 20, reviewer: 'Dana Kim', status: 'Pending' },
  { key: '7', invoiceId: 'INV-775', customer: 'Wayne Ent', quantity: 9, reviewer: 'Jordan Lee', status: 'Approved' },
  { key: '8', invoiceId: 'INV-776', customer: 'Acme Corp', quantity: 4, reviewer: 'Alex Chen', status: 'Pending' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<InvoiceRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (record: InvoiceRow) => record.key === editingKey;

  const edit = (record: InvoiceRow) => {
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

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.invoiceId === 'INV-771');
    if (row && row.quantity === 17 && row.reviewer.trim() === 'Mina Patel' && editingKey !== row.key) {
      successFired.current = true;
      onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const columns = [
    { title: 'Invoice ID', dataIndex: 'invoiceId', width: 100, sorter: (a: InvoiceRow, b: InvoiceRow) => a.invoiceId.localeCompare(b.invoiceId) },
    { title: 'Customer', dataIndex: 'customer', width: 120, sorter: (a: InvoiceRow, b: InvoiceRow) => a.customer.localeCompare(b.customer) },
    {
      title: 'Quantity', dataIndex: 'quantity', width: 90,
      render: (_: number, record: InvoiceRow) =>
        isEditing(record) ? <Form.Item name="quantity" style={{ margin: 0 }}><InputNumber size="small" min={1} /></Form.Item> : record.quantity,
    },
    {
      title: 'Reviewer', dataIndex: 'reviewer', width: 130,
      render: (_: string, record: InvoiceRow) =>
        isEditing(record) ? <Form.Item name="reviewer" style={{ margin: 0 }}><Input size="small" /></Form.Item> : record.reviewer,
    },
    { title: 'Status', dataIndex: 'status', width: 90, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Actions', width: 120,
      render: (_: unknown, record: InvoiceRow) =>
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
    <div style={{ display: 'flex', gap: 16, padding: 24, justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '100vh' }}>
      <Card size="small" style={{ width: 200 }}>
        <Text strong>Ledger summary</Text>
        <div style={{ marginTop: 8 }}><Text type="secondary">Total invoices: 8</Text></div>
        <div><Text type="secondary">Pending: 4</Text></div>
      </Card>
      <div>
        <Card size="small" style={{ marginBottom: 8 }}>
          <Space><Tag color="blue">Q3 Cycle</Tag><Tag>8 invoices</Tag><Tag color="green">$48,200 total</Tag></Space>
        </Card>
        <Card size="small" title="Invoices" style={{ width: 680 }}>
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
        </Card>
      </div>
    </div>
  );
}
