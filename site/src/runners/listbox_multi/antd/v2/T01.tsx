'use client';

/**
 * listbox_multi-antd-v2-T01: Billing alerts drawer with mirrored groups
 *
 * Drawer with two Checkbox.Group sections (Customer alerts + Billing alerts).
 * Billing alerts is the TARGET. Overlapping labels between groups.
 * Billing initial: Invoice sent, Chargeback opened.
 * Customer initial: Welcome email (must remain unchanged).
 * Target Billing: Invoice failed, Chargeback opened, Renewal failed, Tax reminder.
 * Confirm via "Save routing".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Checkbox, Drawer, Space, Typography, Tag, Divider } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const billingOptions = [
  'Invoice sent', 'Invoice failed', 'Chargeback opened', 'Renewal failed',
  'Reminder sent', 'Tax reminder', 'Escalation opened', 'Security notice',
];

const customerOptions = [
  'Welcome email', 'Renewal failed', 'Reminder sent',
  'Escalation opened', 'Security notice', 'Onboarding complete',
];

const targetSet = ['Invoice failed', 'Chargeback opened', 'Renewal failed', 'Tax reminder'];
const customerInitial = ['Welcome email'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [billing, setBilling] = useState<string[]>(['Invoice sent', 'Chargeback opened']);
  const [customer, setCustomer] = useState<string[]>(['Welcome email']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(billing, targetSet) && setsEqual(customer, customerInitial)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, billing, customer, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 560 }}>
        <Title level={4} style={{ margin: 0 }}>Billing Dashboard</Title>
        <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
          Overview of billing metrics and alert routing
        </Text>
        <Space style={{ marginTop: 16 }}>
          <Tag color="blue">MRR: $42k</Tag>
          <Tag color="green">Churn: 1.2%</Tag>
          <Tag>Alerts: 7 active</Tag>
        </Space>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => { setDrawerOpen(true); setSaved(false); }}>
            Edit alert routing
          </Button>
        </div>
      </Card>

      <Drawer
        title="Edit alert routing"
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save routing</Button>
          </div>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Customer alerts</Text>
        <Checkbox.Group
          value={customer}
          onChange={(vals) => { setCustomer(vals as string[]); setSaved(false); }}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {customerOptions.map(opt => (
              <Checkbox key={opt} value={opt}>{opt}</Checkbox>
            ))}
          </Space>
        </Checkbox.Group>

        <Divider />

        <Text strong style={{ display: 'block', marginBottom: 8 }}>Billing alerts</Text>
        <Checkbox.Group
          value={billing}
          onChange={(vals) => { setBilling(vals as string[]); setSaved(false); }}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {billingOptions.map(opt => (
              <Checkbox key={opt} value={opt}>{opt}</Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Drawer>
    </div>
  );
}
