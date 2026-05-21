'use client';

/**
 * segmented_control-antd-T01: Billing cycle → Monthly
 *
 * Layout: isolated card centered in the viewport on a simple "Subscription" page.
 * The card is titled "Billing settings" and contains a single Ant Design Segmented control labeled "Billing cycle".
 * - Options (left to right): "Daily", "Weekly", "Monthly"
 * - Initial state: "Weekly" is selected (highlighted).
 * - The control is the default size and uses comfortable spacing.
 *
 * There are no other interactive elements in the card besides the segmented control (no Apply button; changes apply immediately).
 *
 * Success: The AntD Segmented labeled "Billing cycle" has selected value = Monthly.
 */

import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['Daily', 'Weekly', 'Monthly'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Weekly');

  const handleChange = (value: string | number) => {
    const val = String(value);
    setSelected(val);
    if (val === 'Monthly') {
      onSuccess();
    }
  };

  return (
    <Card title="Billing settings" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Billing cycle</Text>
      <Segmented
        data-testid="billing-cycle"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        options={options}
        value={selected}
        onChange={handleChange}
      />
    </Card>
  );
}
