'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface MemberRow {
  key: string;
  memberId: string;
  role: string;
  reviewer: string;
  status: string;
}

const statusOptions = ['Active', 'Inactive', 'Blocked', 'On leave'];

const teamAData: MemberRow[] = [
  { key: 'a1', memberId: 'TM-12', role: 'Engineer', reviewer: 'Alex Chen', status: 'Active' },
  { key: 'a2', memberId: 'TM-13', role: 'Designer', reviewer: 'Priya Shah', status: 'Active' },
  { key: 'a3', memberId: 'TM-14', role: 'Engineer', reviewer: 'Jordan Lee', status: 'Active' },
  { key: 'a4', memberId: 'TM-15', role: 'QA', reviewer: 'Sam Rivera', status: 'Inactive' },
];

const teamBInitial: MemberRow[] = [
  { key: 'b1', memberId: 'TM-12', role: 'DevOps', reviewer: 'Mina Ortiz', status: 'Active' },
  { key: 'b2', memberId: 'TM-13', role: 'Engineer', reviewer: 'Jordan Lee', status: 'Blocked' },
  { key: 'b3', memberId: 'TM-14', role: 'Lead', reviewer: 'Dana Lee', status: 'Active' },
  { key: 'b4', memberId: 'TM-15', role: 'Designer', reviewer: 'Alex Chen', status: 'On leave' },
];

export default function T16({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [teamB, setTeamB] = useState<MemberRow[]>(teamBInitial);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [cancelledKey, setCancelledKey] = useState<string | null>(null);

  const isEditing = (r: MemberRow) => r.key === editingKey;
  const edit = (r: MemberRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = (key: string) => { setEditingKey(''); setCancelledKey(key); };
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...teamB]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setTeamB(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    if (cancelledKey !== 'b3') return;
    const row = teamB.find((r) => r.memberId === 'TM-14');
    if (row && row.reviewer.trim() === 'Dana Lee' && row.status === 'Active' && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [teamB, editingKey, cancelledKey, onSuccess]);

  const makeCols = (isTarget: boolean, saveHandler?: (key: string) => void) => [
    { title: 'Member ID', dataIndex: 'memberId', width: 95 },
    { title: 'Role', dataIndex: 'role', width: 90 },
    {
      title: 'Reviewer', dataIndex: 'reviewer', width: 120,
      render: (_: string, r: MemberRow) => isTarget && isEditing(r)
        ? <Form.Item name="reviewer" style={{ margin: 0 }}><Input size="small" /></Form.Item> : r.reviewer,
    },
    {
      title: 'Status', dataIndex: 'status', width: 100,
      render: (_: string, r: MemberRow) => isTarget && isEditing(r)
        ? <Form.Item name="status" style={{ margin: 0 }}><Select size="small" options={statusOptions.map((s) => ({ value: s, label: s }))} /></Form.Item>
        : <Tag>{r.status}</Tag>,
    },
    ...(isTarget ? [{
      title: 'Actions', width: 130,
      render: (_: unknown, r: MemberRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => saveHandler!(r.key)}>Save</Button><Button size="small" type="link" onClick={() => cancel(r.key)}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    }] : []),
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}><Tag color="blue">Staffing</Tag><Text type="secondary">Page 1 of 3</Text></Space>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card size="small" title="Team A" style={{ flex: 1 }}>
          <Table dataSource={teamAData} columns={makeCols(false) as any} pagination={false} size="small" bordered />
        </Card>
        <Card size="small" title="Team B" style={{ flex: 1 }}>
          <Form form={form} component={false}>
            <Table dataSource={teamB} columns={makeCols(true, save) as any} pagination={false} size="small" bordered />
          </Form>
        </Card>
      </div>
      <Card size="small" style={{ marginTop: 12, width: 300 }}><Text type="secondary">Summary: 8 total members across 2 teams</Text></Card>
    </div>
  );
}
