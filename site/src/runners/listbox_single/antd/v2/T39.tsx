'use client';

/**
 * listbox_single-antd-v2-T39: Billing sections list: scroll to Exceptions and continue
 *
 * A right-side nested panel has a compact AntD Menu labeled "Billing sections". The list is
 * taller than its viewport (small fixed-height container). Visible items at top: Summary, Rates,
 * Invoices, Credits. "Exceptions" is farther down and not visible. Footer has "Continue".
 * Selection committed only after Continue.
 *
 * Success: Billing sections = "exceptions", "Continue" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Menu, Button, Typography, Space, Tag, Divider } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const sections = [
  { key: 'summary', label: 'Summary' },
  { key: 'rates', label: 'Rates' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'credits', label: 'Credits' },
  { key: 'adjustments', label: 'Adjustments' },
  { key: 'taxes', label: 'Taxes' },
  { key: 'disputes', label: 'Disputes' },
  { key: 'exceptions', label: 'Exceptions' },
  { key: 'refunds', label: 'Refunds' },
  { key: 'overages', label: 'Overages' },
];

export default function T39({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('summary');
  const [continued, setContinued] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (continued && selected === 'exceptions') {
      successFired.current = true;
      onSuccess();
    }
  }, [continued, selected, onSuccess]);

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
    setContinued(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-end' }}>
      <Card style={{ width: 320 }}>
        <Title level={5} style={{ margin: 0 }}>Billing Sections</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          Choose the section to review.
        </Text>

        <div style={{ height: 180, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 6 }}>
          <Menu
            data-cb-listbox-root
            data-cb-selected-value={selected}
            mode="inline"
            selectedKeys={[selected]}
            onSelect={handleSelect}
            items={sections.map(s => ({
              key: s.key,
              label: s.label,
              'data-cb-option-value': s.key,
            }))}
            style={{ border: 'none' }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <Space>
          <Tag>Period: Q4 2025</Tag>
          <Tag color="blue">Account: Enterprise</Tag>
        </Space>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={() => setContinued(true)}>Continue</Button>
        </div>
      </Card>
    </div>
  );
}
