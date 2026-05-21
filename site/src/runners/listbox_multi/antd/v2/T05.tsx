'use client';

/**
 * listbox_multi-antd-v2-T05: Payments row escalation channels
 *
 * Table with two expanded rows (Payments, Identity), each containing a checkbox list
 * "Escalation channels" and a row-local "Save row" button.
 * Payments (TARGET) initial: Email, Pager. Identity initial: Pager (must remain unchanged).
 * Target Payments: Pager, Slack, Runbook. Confirm via "Save row" for Payments.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Checkbox, Space, Table, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const channelOptions = ['Pager', 'Email', 'Slack', 'SMS', 'Runbook', 'Auto-retry'];

const targetSet = ['Pager', 'Slack', 'Runbook'];
const identityInitial = ['Pager'];

interface RowData {
  key: string;
  service: string;
  status: string;
  priority: string;
}

const rows: RowData[] = [
  { key: 'payments', service: 'Payments', status: 'Healthy', priority: 'Critical' },
  { key: 'identity', service: 'Identity', status: 'Healthy', priority: 'High' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [paymentsChannels, setPaymentsChannels] = useState<string[]>(['Email', 'Pager']);
  const [identityChannels, setIdentityChannels] = useState<string[]>(['Pager']);
  const [paymentsSaved, setPaymentsSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      paymentsSaved &&
      setsEqual(paymentsChannels, targetSet) &&
      setsEqual(identityChannels, identityInitial)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [paymentsSaved, paymentsChannels, identityChannels, onSuccess]);

  const columns = [
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color="green">{v}</Tag> },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (v: string) => <Tag color={v === 'Critical' ? 'red' : 'orange'}>{v}</Tag> },
  ];

  const renderExpanded = (record: RowData) => {
    const isPayments = record.key === 'payments';
    const selected = isPayments ? paymentsChannels : identityChannels;
    const setSelected = isPayments
      ? (vals: string[]) => { setPaymentsChannels(vals); setPaymentsSaved(false); }
      : (vals: string[]) => setIdentityChannels(vals);

    return (
      <div style={{ padding: '8px 16px' }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Escalation channels</Text>
        <Checkbox.Group
          value={selected}
          onChange={(vals) => setSelected(vals as string[])}
          style={{ width: '100%' }}
        >
          <Space direction="vertical">
            {channelOptions.map(opt => (
              <Checkbox key={opt} value={opt}>{opt}</Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
        <div style={{ marginTop: 12 }}>
          <Button
            type="primary"
            size="small"
            data-testid={`save-row-${record.key}`}
            onClick={() => { if (isPayments) setPaymentsSaved(true); }}
          >
            Save row
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 640 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>Service routing</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Configure escalation channels per service
        </Text>
        <Table
          dataSource={rows}
          columns={columns}
          expandable={{
            expandedRowRender: renderExpanded,
            defaultExpandedRowKeys: ['payments', 'identity'],
          }}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
