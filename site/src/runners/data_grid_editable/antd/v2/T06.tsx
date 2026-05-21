'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, DatePicker, Card, Button, Form, Tag, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface RoutingRow {
  key: string;
  routeId: string;
  region: string;
  startDate: string;
  driver: string;
}

const initialData: RoutingRow[] = [
  { key: '1', routeId: 'RT-10', region: 'North', startDate: '2026-09-01', driver: 'Dana Kim' },
  { key: '2', routeId: 'RT-11', region: 'South', startDate: '2026-10-15', driver: 'Alex Chen' },
  { key: '3', routeId: 'RT-12', region: 'East', startDate: '2026-08-20', driver: 'Jordan Lee' },
  { key: '4', routeId: 'RT-13', region: 'West', startDate: '2026-12-01', driver: 'Liam Torres' },
  { key: '5', routeId: 'RT-14', region: 'Central', startDate: '2026-07-10', driver: 'Priya Shah' },
  { key: '6', routeId: 'RT-15', region: 'North', startDate: '2026-11-22', driver: 'Mina Ortiz' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [data, setData] = useState<RoutingRow[]>(initialData);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const isEditing = (r: RoutingRow) => r.key === editingKey;

  const edit = (r: RoutingRow) => {
    form.setFieldsValue({ ...r, startDate: dayjs(r.startDate) });
    setEditingKey(r.key);
  };

  const cancel = () => setEditingKey('');

  const save = async (key: string) => {
    const vals = await form.validateFields();
    if (vals.startDate && dayjs.isDayjs(vals.startDate)) vals.startDate = vals.startDate.format('YYYY-MM-DD');
    const d = [...data]; const idx = d.findIndex((i) => i.key === key);
    d[idx] = { ...d[idx], ...vals }; setData(d); setEditingKey('');
  };

  useEffect(() => {
    if (successFired.current) return;
    const row = data.find((r) => r.routeId === 'RT-12');
    if (row && row.startDate === '2026-11-03' && editingKey !== row.key) {
      successFired.current = true; onSuccess();
    }
  }, [data, editingKey, onSuccess]);

  const columns = [
    { title: 'Route ID', dataIndex: 'routeId', width: 90 },
    { title: 'Region', dataIndex: 'region', width: 90, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Start date', dataIndex: 'startDate', width: 160,
      render: (_: string, r: RoutingRow) => isEditing(r)
        ? <Form.Item name="startDate" style={{ margin: 0 }}><DatePicker needConfirm onOk={() => {}} size="small" /></Form.Item>
        : r.startDate,
    },
    {
      title: 'Driver', dataIndex: 'driver', width: 130,
      render: (_: string, r: RoutingRow) => isEditing(r)
        ? <Form.Item name="driver" style={{ margin: 0 }}><Input size="small" /></Form.Item>
        : r.driver,
    },
    {
      title: 'Actions', width: 130,
      render: (_: unknown, r: RoutingRow) => isEditing(r)
        ? <Space size="small">
            <Button size="small" type="link" onClick={() => save(r.key)}>Save</Button>
            <Button size="small" type="link" onClick={cancel}>Cancel</Button>
          </Space>
        : <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => edit(r)}>Edit</Button>,
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', minHeight: '100vh', padding: 24 }}>
      <div>
        <Space style={{ marginBottom: 8 }}><Tag color="blue">Active routes: 6</Tag><Tag color="green">On-time: 83%</Tag></Space>
        <div style={{ display: 'flex', gap: 16 }}>
          <Card size="small" title="Routing" style={{ width: 620 }}>
            <Form form={form} component={false}>
              <Table dataSource={data} columns={columns as any} pagination={false} size="small" bordered />
            </Form>
          </Card>
          <Card size="small" style={{ width: 200 }}>
            <Text strong>Fleet summary</Text>
            <div style={{ marginTop: 8 }}><Text type="secondary">Vehicles: 12</Text></div>
            <div><Text type="secondary">Available: 5</Text></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
