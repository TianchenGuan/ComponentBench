'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, InputNumber, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface ContractRow {
  key: string;
  contractId: string;
  vendor: string;
  type: string;
  discount: number;
  penalty: number;
  ceiling: number;
}

const initialData: ContractRow[] = [
  { key: '1', contractId: 'CT-89', vendor: 'Acme Corp', type: 'SaaS', discount: 5, penalty: 1000, ceiling: 50000 },
  { key: '2', contractId: 'CT-90', vendor: 'Globex Inc', type: 'Support', discount: 10, penalty: 500, ceiling: 25000 },
  { key: '3', contractId: 'CT-91', vendor: 'Stark Ltd', type: 'License', discount: 8, penalty: 1500, ceiling: 80000 },
  { key: '4', contractId: 'CT-92', vendor: 'Wayne Ent', type: 'SaaS', discount: 12, penalty: 750, ceiling: 40000 },
  { key: '5', contractId: 'CT-93', vendor: 'Osborn Co', type: 'Support', discount: 3, penalty: 2000, ceiling: 60000 },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<ContractRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: ContractRow) => r.key === editingKey;
  const edit = (r: ContractRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.contractId === 'CT-91');
    if (row && row.penalty === 2400 && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const columns = [
    { title: 'Contract ID', dataIndex: 'contractId', width: 100, fixed: 'left' as const },
    { title: 'Vendor', dataIndex: 'vendor', width: 120 },
    { title: 'Type', dataIndex: 'type', width: 100, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Discount (%)', dataIndex: 'discount', width: 110,
      render: (_: number, r: ContractRow) => isEditing(r)
        ? <Form.Item name="discount" style={{ margin: 0 }}><InputNumber size="small" min={0} max={100} /></Form.Item>
        : `${r.discount}%`,
    },
    {
      title: 'Penalty', dataIndex: 'penalty', width: 130,
      render: (_: number, r: ContractRow) => isEditing(r)
        ? <Form.Item name="penalty" style={{ margin: 0 }}><InputNumber size="small" min={0} precision={2} /></Form.Item>
        : `$${r.penalty.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Ceiling', dataIndex: 'ceiling', width: 130,
      render: (_: number, r: ContractRow) => isEditing(r)
        ? <Form.Item name="ceiling" style={{ margin: 0 }}><InputNumber size="small" min={0} /></Form.Item>
        : `$${r.ceiling.toLocaleString()}`,
    },
    {
      title: 'Actions', width: 130, fixed: 'right' as const,
      render: (_: unknown, r: ContractRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Space><Tag>Billing toggles: Auto-renew ON</Tag><Text type="secondary">Contracts management</Text></Space>
        <Card size="small" title="Contracts" style={{ width: 580 }}>
          <Form form={form} component={false}>
            <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered scroll={{ x: 900 }} />
          </Form>
        </Card>
        <Card size="small" style={{ width: 300 }}><Text type="secondary">Summary: 5 active contracts, $255k total ceiling</Text></Card>
      </Space>
    </div>
  );
}
