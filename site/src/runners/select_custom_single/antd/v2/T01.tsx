'use client';

/**
 * select_custom_single-antd-v2-T01: Drawer state rule — set Shipping state to Wyoming and save
 *
 * Cluttered fulfillment dashboard with charts/KPI cards. "Fulfillment settings" opens a right-side
 * Ant Design Drawer containing two non-searchable Select controls: "Billing state" (Colorado, must stay)
 * and "Shipping state" (Utah → Wyoming). 50-state lists with flag decorations, fixed-height internal scroll.
 * Drawer footer: "Cancel" and "Save state rules". Committed state only updates after save.
 *
 * Success: Shipping state = "Wyoming", Billing state still "Colorado", "Save state rules" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, Select, Typography, Space, Drawer, Statistic, Row, Col, Input, Divider,
} from 'antd';
import {
  BarChartOutlined, ShoppingCartOutlined, SearchOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

const stateOptions = US_STATES.map((s) => ({
  value: s,
  label: (
    <Space size={4}>
      <span style={{ fontSize: 10 }}>🏳️</span>
      {s}
    </Space>
  ),
}));

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [billingState, setBillingState] = useState<string>('Colorado');
  const [shippingState, setShippingState] = useState<string>('Utah');
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && shippingState === 'Wyoming' && billingState === 'Colorado') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, shippingState, billingState, onSuccess]);

  const handleSave = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <Title level={4}><ShoppingCartOutlined /> Fulfillment Dashboard</Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card size="small"><Statistic title="Orders today" value={238} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Shipped" value={184} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Pending" value={54} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Returns" value={7} /></Card></Col>
      </Row>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Input prefix={<SearchOutlined />} placeholder="Search orders..." style={{ width: 240 }} />
          <Button icon={<BarChartOutlined />}>Analytics</Button>
          <Button onClick={() => setDrawerOpen(true)} type="primary">Fulfillment settings</Button>
        </Space>
      </Card>

      <Card size="small" style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text type="secondary">Chart placeholder — daily shipments</Text>
      </Card>

      <Drawer
        title="Fulfillment Settings"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save state rules</Button>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Billing state</Text>
            <Select
              style={{ width: '100%' }}
              value={billingState}
              onChange={(val) => { setBillingState(val); setCommitted(false); }}
              options={stateOptions}
              listHeight={200}
              virtual
            />
          </div>
          <Divider style={{ margin: 0 }} />
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Shipping state</Text>
            <Select
              style={{ width: '100%' }}
              value={shippingState}
              onChange={(val) => { setShippingState(val); setCommitted(false); }}
              options={stateOptions}
              listHeight={200}
              virtual
            />
          </div>
        </Space>
      </Drawer>
    </div>
  );
}
