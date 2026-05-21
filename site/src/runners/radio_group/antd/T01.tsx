'use client';

/**
 * radio_group-antd-T01: Checkout: choose Express shipping
 *
 * A single isolated card titled "Checkout" is centered in the viewport (light theme, comfortable spacing, default scale).
 * It contains one Ant Design Radio.Group labeled "Shipping speed" with three vertically-stacked options:
 * - Standard (5–7 days)
 * - Express (2–3 days)
 * - Overnight (1 day)
 * Initial state: "Standard (5–7 days)" is selected.
 * Below the group is a read-only summary line ("Selected: …") that updates immediately when the selection changes.
 * There is no Apply/Save button; the selection is considered active immediately. No other radio groups are present.
 *
 * Success: The checked/selected option in the "Shipping speed" Radio.Group equals Express (value "express").
 */

import React, { useState } from 'react';
import { Card, Radio, Typography, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Standard (5–7 days)', value: 'standard' },
  { label: 'Express (2–3 days)', value: 'express' },
  { label: 'Overnight (1 day)', value: 'overnight' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('standard');

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setSelected(value);
    if (value === 'express') {
      onSuccess();
    }
  };

  const selectedLabel = options.find(o => o.value === selected)?.label || '';

  return (
    <Card title="Checkout" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Shipping speed</Text>
      <Radio.Group
        data-canonical-type="radio_group"
        data-selected-value={selected}
        value={selected}
        onChange={handleChange}
      >
        <Space direction="vertical">
          {options.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <div style={{ marginTop: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
        <Text type="secondary">Selected: {selectedLabel}</Text>
      </div>
    </Card>
  );
}
