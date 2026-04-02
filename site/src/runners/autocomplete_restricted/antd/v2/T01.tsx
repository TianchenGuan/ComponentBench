'use client';

/**
 * autocomplete_restricted-antd-v2-T01
 *
 * Routing settings panel with two Select controls (Primary region, Fallback region).
 * High clutter: checkboxes, text input, status chips surround the selects.
 * Success: Fallback region cleared to null, Primary region remains us-east-1, Save routing clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Typography, Input, Checkbox, Tag, Button, Space } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const regionOptions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-central-1',
  'ap-southeast-1',
  'ap-northeast-1',
].map((r) => ({ label: r, value: r }));

export default function T01({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState<string | undefined>('us-east-1');
  const [fallback, setFallback] = useState<string | undefined>('eu-west-1');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && fallback === undefined && primary === 'us-east-1') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, fallback, primary, onSuccess]);

  const handleSave = () => setSaved(true);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '24px 48px' }}>
      <Card title="Routing settings" style={{ width: 460 }} size="small">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Checkbox defaultChecked>Enable health checks</Checkbox>
          <Checkbox>Use sticky sessions</Checkbox>
          <Input size="small" placeholder="Custom header" defaultValue="X-Route-Id" style={{ width: '60%' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <Tag color="green">Healthy</Tag>
            <Tag color="orange">Degraded</Tag>
            <Tag>v2.4.1</Tag>
          </div>

          <Text strong style={{ fontSize: 13 }}>Primary region</Text>
          <Select
            size="small"
            style={{ width: '100%' }}
            placeholder="Select region"
            value={primary}
            onChange={(v) => { setPrimary(v); setSaved(false); }}
            allowClear
            showSearch
            filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={regionOptions}
          />

          <Text strong style={{ fontSize: 13 }}>Fallback region</Text>
          <Select
            size="small"
            style={{ width: '100%' }}
            placeholder="Select region"
            value={fallback}
            onChange={(v) => { setFallback(v); setSaved(false); }}
            allowClear
            showSearch
            filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={regionOptions}
          />

          <Button type="primary" size="small" onClick={handleSave} style={{ marginTop: 8 }}>
            Save routing
          </Button>
        </Space>
      </Card>
    </div>
  );
}
