'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface ProgramRow { key: string; programId: string; name: string; lead: string; status: string; }
interface MilestoneRow { key: string; milestoneId: string; title: string; owner: string; status: string; }

const ownerOptions = ['Platform', 'Backend', 'Frontend', 'DevOps', 'QA'];
const statusOptions = ['Not started', 'In progress', 'Ready', 'Blocked'];

const programs: ProgramRow[] = [
  { key: 'p1', programId: 'PR-5', name: 'Cloud Migration', lead: 'Dana Kim', status: 'Active' },
  { key: 'p2', programId: 'PR-6', name: 'Security Audit', lead: 'Priya Shah', status: 'Active' },
  { key: 'p3', programId: 'PR-7', name: 'Platform Rewrite', lead: 'Alex Chen', status: 'Active' },
  { key: 'p4', programId: 'PR-8', name: 'Data Pipeline v2', lead: 'Liam Torres', status: 'Planning' },
];

const childDataMap: Record<string, MilestoneRow[]> = {
  'p1': [{ key: 'c1', milestoneId: 'M-1', title: 'Assess workloads', owner: 'Backend', status: 'Ready' }],
  'p2': [{ key: 'c2', milestoneId: 'M-2', title: 'Pen test round 1', owner: 'QA', status: 'In progress' }],
  'p3': [
    { key: 'c3', milestoneId: 'M-1', title: 'API design review', owner: 'Backend', status: 'Ready' },
    { key: 'c4', milestoneId: 'M-2', title: 'Schema migration', owner: 'DevOps', status: 'In progress' },
    { key: 'c5', milestoneId: 'M-3', title: 'Service mesh rollout', owner: 'DevOps', status: 'Not started' },
    { key: 'c6', milestoneId: 'M-4', title: 'Load testing', owner: 'QA', status: 'Not started' },
  ],
  'p4': [{ key: 'c7', milestoneId: 'M-1', title: 'Data model draft', owner: 'Backend', status: 'Not started' }],
};

export default function T10({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [children, setChildren] = useState<Record<string, MilestoneRow[]>>(childDataMap);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: MilestoneRow) => r.key === editingKey;
  const edit = (r: MilestoneRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');

  const save = async (parentKey: string, childKey: string) => {
    const vals = await form.validateFields();
    const newChildren = { ...children };
    const arr = [...newChildren[parentKey]];
    const idx = arr.findIndex((c) => c.key === childKey);
    arr[idx] = { ...arr[idx], ...vals };
    newChildren[parentKey] = arr;
    setChildren(newChildren);
    setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const pr7 = children['p3'];
    if (!pr7) return;
    const m3 = pr7.find((r) => r.milestoneId === 'M-3');
    if (m3 && m3.owner.trim() === 'Platform' && m3.status === 'Ready' && editingKey !== m3.key) {
      successFired.current = true; onSuccess();
    }
  }, [children, editingKey, onSuccess]);

  const childCols = (parentKey: string) => [
    { title: 'Milestone ID', dataIndex: 'milestoneId', width: 100 },
    { title: 'Title', dataIndex: 'title', width: 180 },
    {
      title: 'Owner', dataIndex: 'owner', width: 120,
      render: (_: string, r: MilestoneRow) => isEditing(r)
        ? <Form.Item name="owner" style={{ margin: 0 }}><Input size="small" /></Form.Item> : r.owner,
    },
    {
      title: 'Status', dataIndex: 'status', width: 120,
      render: (_: string, r: MilestoneRow) => isEditing(r)
        ? <Form.Item name="status" style={{ margin: 0 }}><Select size="small" options={statusOptions.map((s) => ({ value: s, label: s }))} /></Form.Item>
        : <Tag>{r.status}</Tag>,
    },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: MilestoneRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(parentKey, r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  const parentCols = [
    { title: 'Program ID', dataIndex: 'programId', width: 100 },
    { title: 'Name', dataIndex: 'name', width: 200 },
    { title: 'Lead', dataIndex: 'lead', width: 130 },
    { title: 'Status', dataIndex: 'status', width: 100, render: (v: string) => <Tag>{v}</Tag> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}>
        <Tag color="blue">4 programs</Tag><Tag color="green">12 milestones</Tag>
        <Text type="secondary">Timeline: Q3–Q4 2026</Text>
      </Space>
      <Card size="small" title="Programs" style={{ width: 750 }}>
        <Form form={form} component={false}>
          <Table
            dataSource={programs}
            columns={parentCols as any}
            pagination={false}
            size="small"
            bordered
            expandable={{
              expandedRowRender: (record) => (
                <Table
                  dataSource={children[record.key] || []}
                  columns={childCols(record.key) as any}
                  pagination={false}
                  size="small"
                  bordered
                  title={() => <Text strong>Milestones</Text>}
                />
              ),
            }}
          />
        </Form>
      </Card>
    </div>
  );
}
