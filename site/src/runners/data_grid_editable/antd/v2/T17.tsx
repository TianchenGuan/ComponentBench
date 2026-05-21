'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Select, Card, Button, Drawer, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface CaseRow {
  key: string;
  caseId: string;
  title: string;
  reviewer: string;
  status: string;
}

const people = [
  'Dana Kim', 'Dana King', 'Dana Knight', 'Alex Chen', 'Alex Chang',
  'Jordan Lee', 'Priya Shah', 'Mina Ortiz', 'Sam Rivera', 'Liam Torres',
  'Nina Park', 'Riley Park', 'Casey Morgan', 'Robin Hayes', 'Jamie Cruz',
];

const initialData: CaseRow[] = [
  { key: '1', caseId: 'CS-85', title: 'Billing dispute Q3', reviewer: 'Alex Chen', status: 'Open' },
  { key: '2', caseId: 'CS-86', title: 'Account lockout', reviewer: 'Jordan Lee', status: 'Open' },
  { key: '3', caseId: 'CS-87', title: 'Data export request', reviewer: 'Priya Shah', status: 'In progress' },
  { key: '4', caseId: 'CS-88', title: 'SLA breach investigation', reviewer: 'Liam Torres', status: 'Open' },
  { key: '5', caseId: 'CS-89', title: 'Integration failure', reviewer: 'Sam Rivera', status: 'Open' },
  { key: '6', caseId: 'CS-90', title: 'Permission escalation', reviewer: 'Mina Ortiz', status: 'In progress' },
];

export default function T17({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState<CaseRow[]>(initialData);
  const [committed, setCommitted] = useState<CaseRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: CaseRow) => r.key === editingKey;
  const edit = (r: CaseRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  const handleApply = () => { setCommitted([...data]); setDrawerOpen(false); };

  useEffect(() => {
    if (successFired.current) return;
    const row = committed.find((r) => r.caseId === 'CS-88');
    if (row && row.reviewer.trim() === 'Dana Kim' && !drawerOpen) {
      successFired.current = true; onSuccess();
    }
  }, [committed, drawerOpen, onSuccess]);

  const columns = [
    { title: 'Case ID', dataIndex: 'caseId', width: 90 },
    { title: 'Title', dataIndex: 'title', width: 180 },
    {
      title: 'Reviewer', dataIndex: 'reviewer', width: 140,
      render: (_: string, r: CaseRow) => isEditing(r)
        ? <Form.Item name="reviewer" style={{ margin: 0 }}>
            <Select showSearch size="small" style={{ width: '100%' }}
              options={people.map((p) => ({ value: p, label: p }))}
              filterOption={(input, opt) => (opt?.label as string).toLowerCase().includes(input.toLowerCase())} />
          </Form.Item>
        : r.reviewer,
    },
    { title: 'Status', dataIndex: 'status', width: 100, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: CaseRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card size="small" style={{ maxWidth: 350, marginBottom: 16 }}>
        <Text>Triage management</Text>
        <div style={{ marginTop: 12 }}><Button type="primary" onClick={() => setDrawerOpen(true)}>Open triage</Button></div>
      </Card>
      <Drawer
        title="Cases"
        open={drawerOpen}
        onClose={() => { setData([...committed]); setEditingKey(''); setDrawerOpen(false); }}
        width={700}
        footer={<Space><Button onClick={() => { setData([...committed]); setEditingKey(''); setDrawerOpen(false); }}>Cancel</Button><Button type="primary" onClick={handleApply}>Apply triage changes</Button></Space>}
      >
        <Space style={{ marginBottom: 8 }}><Tag>Filters: All</Tag><Button size="small" disabled>Export</Button></Space>
        <Form form={form} component={false}>
          <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
        </Form>
      </Drawer>
    </div>
  );
}
