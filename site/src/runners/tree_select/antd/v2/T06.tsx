'use client';

/**
 * tree_select-antd-v2-T06: Three-instance visual reference — choose only Fallback route
 *
 * Dashboard panel with high clutter. Three TreeSelect controls: Primary, Secondary, Fallback route.
 * A visual reference card highlights "On-call / Platform / Database". Only Fallback changes.
 * Primary = On-call/Platform/API, Secondary = On-call/Support/Identity.
 *
 * Success: Fallback = on-call-platform-database, others unchanged, "Save routes" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, TreeSelect, Button, Typography, Tag, Space, Statistic, Row, Col } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const routeTree = [
  {
    value: 'on-call', title: 'On-call', selectable: false, children: [
      {
        value: 'on-call-platform', title: 'Platform', selectable: false, children: [
          { value: 'on-call-platform-api', title: 'API' },
          { value: 'on-call-platform-database', title: 'Database' },
          { value: 'on-call-platform-cache', title: 'Cache' },
          { value: 'on-call-platform-queue', title: 'Queue' },
        ],
      },
      {
        value: 'on-call-support', title: 'Support', selectable: false, children: [
          { value: 'on-call-support-identity', title: 'Identity' },
          { value: 'on-call-support-billing', title: 'Billing' },
        ],
      },
      {
        value: 'on-call-infra', title: 'Infra', selectable: false, children: [
          { value: 'on-call-infra-networking', title: 'Networking' },
          { value: 'on-call-infra-storage', title: 'Storage' },
        ],
      },
    ],
  },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState<string>('on-call-platform-api');
  const [secondary, setSecondary] = useState<string>('on-call-support-identity');
  const [fallback, setFallback] = useState<string | undefined>(undefined);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      fallback === 'on-call-platform-database' &&
      primary === 'on-call-platform-api' &&
      secondary === 'on-call-support-identity'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, fallback, primary, secondary, onSuccess]);

  return (
    <div style={{ padding: 16, maxWidth: 660, marginLeft: 60 }}>
      <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>Incident Management</Text>
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={6}><Card size="small"><Statistic title="Open" value={12} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="P1" value={2} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="MTTR" value="14m" /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Ack" value="98%" /></Card></Col>
      </Row>
      <Card
        size="small"
        style={{ marginBottom: 12, background: '#f6ffed', borderColor: '#b7eb8f' }}
      >
        <Text strong>Reference: </Text>
        <Tag color="green">On-call / Platform / Database</Tag>
      </Card>
      <Card title="Escalation Routes" size="small">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Primary route</Text>
            <TreeSelect
              size="small"
              style={{ width: '100%' }}
              value={primary}
              onChange={(val) => { setPrimary(val); setCommitted(false); }}
              treeData={routeTree}
              showSearch={false}
              dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Secondary route</Text>
            <TreeSelect
              size="small"
              style={{ width: '100%' }}
              value={secondary}
              onChange={(val) => { setSecondary(val); setCommitted(false); }}
              treeData={routeTree}
              showSearch={false}
              dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Fallback route</Text>
            <TreeSelect
              size="small"
              style={{ width: '100%' }}
              value={fallback}
              onChange={(val) => { setFallback(val); setCommitted(false); }}
              treeData={routeTree}
              placeholder="Select fallback route"
              showSearch={false}
              dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
            />
          </div>
          <Button type="primary" onClick={() => setCommitted(true)}>Save routes</Button>
        </Space>
      </Card>
    </div>
  );
}
