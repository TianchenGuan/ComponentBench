'use client';

/**
 * segmented_control-antd-T03: Reset data interval to default (5 min)
 *
 * Layout: isolated card in the center titled "Live data".
 * The card contains:
 * - An Ant Design Segmented control labeled "Data interval".
 *   Options: "1 min", "5 min", "15 min".
 *   Initial state: "15 min" is selected.
 * - Helper text under the control: "Default: 5 min".
 * - A small link-style button labeled "Reset" under the helper text.
 *
 * Clicking "Reset" sets the segmented control back to the default "5 min".
 * There is no Apply/Save step; selection is committed immediately.
 *
 * Success: The Segmented labeled "Data interval" has selected value = 5 min.
 */

import React, { useState } from 'react';
import { Card, Typography, Button } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['1 min', '5 min', '15 min'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('15 min');

  const handleChange = (value: string | number) => {
    const val = String(value);
    setSelected(val);
    if (val === '5 min') {
      onSuccess();
    }
  };

  const handleReset = () => {
    setSelected('5 min');
    onSuccess();
  };

  return (
    <Card title="Live data" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Data interval</Text>
      <Segmented
        data-testid="data-interval"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        options={options}
        value={selected}
        onChange={handleChange}
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
        Default: 5 min
      </Text>
      <Button type="link" style={{ padding: 0, marginTop: 4 }} onClick={handleReset}>
        Reset
      </Button>
    </Card>
  );
}
