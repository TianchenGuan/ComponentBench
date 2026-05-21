'use client';

/**
 * select_custom_multi-antd-v2-T01: Billing labels drawer exact-set repair
 *
 * Drawer flow, compact spacing, medium clutter, bottom-right placement.
 * Notifications dashboard in background with unread table, summary cards, muted search bar.
 * "Edit routing labels" opens a right-side Drawer with two stacked AntD Select fields
 * (mode=multiple, showSearch, maxTagCount=responsive):
 *   - "Incident labels" (must stay: Critical, Pager)
 *   - "Billing labels" ← TARGET (initial: Invoices, Chargebacks → target: Billing alerts, Chargebacks, Renewal failed, Tax reminder)
 * Drawer footer: Cancel / Save labels. Committed only after Save labels.
 *
 * Success: Billing labels = {Billing alerts, Chargebacks, Renewal failed, Tax reminder},
 *          Incident labels unchanged = {Critical, Pager}, Save labels clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, Select, Typography, Space, Drawer, Table, Input, Badge, Row, Col, Statistic,
} from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const routingOptions = [
  'Billing alerts', 'Billing alert (legacy)', 'Chargebacks', 'Chargeback sync',
  'Renewal failed', 'Renewal reminder', 'Tax reminder', 'Tax forms',
  'Refunds', 'Refund delayed', 'Invoices', 'Invoice sync',
  'Critical', 'Pager', 'Escalation', 'Security notice',
].map(v => ({ label: v, value: v }));

const notifColumns = [
  { title: 'Subject', dataIndex: 'subject', key: 'subject' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Time', dataIndex: 'time', key: 'time' },
];
const notifData = [
  { key: '1', subject: 'Invoice #4021 overdue', status: 'Unread', time: '2 min ago' },
  { key: '2', subject: 'Chargeback opened #887', status: 'Unread', time: '8 min ago' },
  { key: '3', subject: 'Renewal reminder sent', status: 'Read', time: '1 hr ago' },
  { key: '4', subject: 'Tax form submitted', status: 'Read', time: '3 hr ago' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [incidentLabels, setIncidentLabels] = useState<string[]>(['Critical', 'Pager']);
  const [billingLabels, setBillingLabels] = useState<string[]>(['Invoices', 'Chargebacks']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(billingLabels, ['Billing alerts', 'Chargebacks', 'Renewal failed', 'Tax reminder']) &&
      setsEqual(incidentLabels, ['Critical', 'Pager'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, billingLabels, incidentLabels, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <Title level={4}><BellOutlined /> Notifications Dashboard</Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card size="small"><Statistic title="Unread" value={12} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title="Actioned" value={47} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title="Snoozed" value={3} /></Card></Col>
      </Row>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Input prefix={<SearchOutlined />} placeholder="Search notifications..." style={{ width: 260 }} disabled />
          <Button type="primary" onClick={() => setDrawerOpen(true)}>Edit routing labels</Button>
        </Space>
      </Card>

      <Table columns={notifColumns} dataSource={notifData} size="small" pagination={false} />

      <Drawer
        title="Routing Labels"
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save labels</Button>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Incident labels</Text>
            <Select
              mode="multiple"
              showSearch
              maxTagCount="responsive"
              style={{ width: '100%' }}
              value={incidentLabels}
              onChange={(v) => { setIncidentLabels(v); setSaved(false); }}
              options={routingOptions}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Billing labels</Text>
            <Select
              mode="multiple"
              showSearch
              maxTagCount="responsive"
              style={{ width: '100%' }}
              value={billingLabels}
              onChange={(v) => { setBillingLabels(v); setSaved(false); }}
              options={routingOptions}
            />
          </div>
        </Space>
      </Drawer>
    </div>
  );
}
