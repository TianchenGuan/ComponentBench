'use client';

/**
 * select_with_search-antd-v2-T01: Billing market with label-based search and explicit save
 *
 * Settings panel with two Ant Design Select controls (showSearch, optionFilterProp="label"):
 * - Shipping market — Germany (pre-filled)
 * - Billing market — (empty)
 *
 * Confusable options: Congo (Republic), Congo (DRC), Congo (Brazzaville), Cameroon.
 * Success: Billing market = "Congo (DRC)", Shipping market still Germany, Save markets clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Button, Typography, Space, Tag, Divider } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const marketOptions = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Cameroon', label: 'Cameroon' },
  { value: 'Congo (Republic)', label: 'Congo (Republic)' },
  { value: 'Congo (DRC)', label: 'Congo (DRC)' },
  { value: 'Congo (Brazzaville)', label: 'Congo (Brazzaville)' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Australia', label: 'Australia' },
  { value: 'India', label: 'India' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [shippingMarket, setShippingMarket] = useState<string>('Germany');
  const [billingMarket, setBillingMarket] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && billingMarket === 'Congo (DRC)' && shippingMarket === 'Germany') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, billingMarket, shippingMarket, onSuccess]);

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 500 }}>
        <Card title="Market Settings" style={{ width: 460 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Shipping market</Text>
              <Select
                showSearch
                optionFilterProp="label"
                style={{ width: '100%' }}
                placeholder="Select a market"
                value={shippingMarket}
                onChange={(val) => { setShippingMarket(val); setSaved(false); }}
                options={marketOptions}
              />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>Billing market</Text>
              <Select
                showSearch
                optionFilterProp="label"
                style={{ width: '100%' }}
                placeholder="Select a market"
                value={billingMarket}
                onChange={(val) => { setBillingMarket(val); setSaved(false); }}
                options={marketOptions}
              />
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Tag color="blue">Region: EMEA</Tag>
                <Tag>Tier: Standard</Tag>
              </Space>
              <Button type="primary" onClick={handleSave}>Save markets</Button>
            </div>
          </Space>
        </Card>

        <Card size="small" style={{ width: 460, marginTop: 16 }}>
          <Title level={5} style={{ margin: 0 }}>Quick Stats</Title>
          <Text type="secondary">Active orders: 142 · Pending reviews: 7 · Last sync: 3m ago</Text>
        </Card>
      </div>
    </div>
  );
}
