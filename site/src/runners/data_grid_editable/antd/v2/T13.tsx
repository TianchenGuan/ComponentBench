'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Select, Card, Button, Form, Tag, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface IncidentRow {
  key: string;
  incidentId: string;
  service: string;
  severity: string;
  owner: string;
}

const severityOptions = ['P1', 'P2', 'P3', 'P4'];
const REFERENCE_SEVERITY = 'P1';

const makeRows = (prefix: string, offset: number): IncidentRow[] => [
  { key: `${prefix}-1`, incidentId: `INC-${17 + offset}`, service: 'API Gateway', severity: 'P3', owner: 'Dana Kim' },
  { key: `${prefix}-2`, incidentId: `INC-${18 + offset}`, service: 'Auth Service', severity: 'P2', owner: 'Alex Chen' },
  { key: `${prefix}-3`, incidentId: `INC-${19 + offset}`, service: 'DB Cluster', severity: 'P4', owner: 'Jordan Lee' },
  { key: `${prefix}-4`, incidentId: `INC-${20 + offset}`, service: 'CDN', severity: 'P3', owner: 'Priya Shah' },
  { key: `${prefix}-5`, incidentId: `INC-${21 + offset}`, service: 'Scheduler', severity: 'P2', owner: 'Mina Ortiz' },
];

export default function T13({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [onCallData, setOnCallData] = useState<IncidentRow[]>(makeRows('oc', 0));
  const [overflowData] = useState<IncidentRow[]>(makeRows('of', 10));
  const [onCallCommitted, setOnCallCommitted] = useState<IncidentRow[]>(makeRows('oc', 0));
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: IncidentRow) => r.key === editingKey;
  const edit = (r: IncidentRow) => { form.setFieldsValue({ ...r }); setEditingKey(r.key); };
  const cancel = () => setEditingKey('');
  const save = async (key: string) => {
    const vals = await form.validateFields();
    const d = [...onCallData]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setOnCallData(d); setEditingKey('');
  };

  const applyQueue = () => { setOnCallCommitted([...onCallData]); };

  useEffect(() => {
    if (successFired.current) return;
    const row = onCallCommitted.find((r) => r.incidentId === 'INC-19');
    if (row && row.severity === REFERENCE_SEVERITY) { successFired.current = true; onSuccess(); }
  }, [onCallCommitted, onSuccess]);

  const makeCols = (isOnCall: boolean) => [
    { title: 'Incident ID', dataIndex: 'incidentId', width: 100 },
    { title: 'Service', dataIndex: 'service', width: 120 },
    {
      title: 'Severity', dataIndex: 'severity', width: 100,
      render: (_: string, r: IncidentRow) => isOnCall && isEditing(r)
        ? <Form.Item name="severity" style={{ margin: 0 }}><Select size="small" options={severityOptions.map((s) => ({ value: s, label: s }))} /></Form.Item>
        : <Tag color={r.severity === 'P1' ? 'red' : r.severity === 'P2' ? 'orange' : 'default'}>{r.severity}</Tag>,
    },
    { title: 'Owner', dataIndex: 'owner', width: 110 },
    ...(isOnCall ? [{
      title: 'Actions', width: 130,
      render: (_: unknown, r: IncidentRow) => isEditing(r)
        ? <Space size="small"><Button size="small" type="link" onClick={() => save(r.key)}>Save</Button><Button size="small" type="link" onClick={cancel}>Cancel</Button></Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: 24, color: '#fff' }}>
      <Card size="small" title="Reference" style={{ width: 200, marginBottom: 12, background: '#1f1f1f', borderColor: '#333' }}
        styles={{ header: { color: '#fff' } }}>
        <Text style={{ color: '#aaa', display: 'block', marginBottom: 8 }}>Target severity:</Text>
        <Tag data-testid="severity-reference" color="red" style={{ fontSize: 14 }}>{REFERENCE_SEVERITY}</Tag>
      </Card>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card size="small" title="On-call queue" style={{ flex: 1, background: '#1f1f1f', borderColor: '#333' }}
          styles={{ header: { color: '#fff' } }}>
          <Form form={form} component={false}>
            <Table dataSource={onCallData} columns={makeCols(true) as any} pagination={false} size="small" bordered />
          </Form>
          <Button size="small" type="primary" style={{ marginTop: 8 }} onClick={applyQueue}>Apply queue changes</Button>
        </Card>
        <Card size="small" title="Overflow queue" style={{ flex: 1, background: '#1f1f1f', borderColor: '#333' }}
          styles={{ header: { color: '#fff' } }}>
          <Table dataSource={overflowData} columns={makeCols(false) as any} pagination={false} size="small" bordered />
        </Card>
      </div>
    </div>
  );
}
