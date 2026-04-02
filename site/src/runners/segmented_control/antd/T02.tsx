'use client';

/**
 * segmented_control-antd-T02: Email notifications → Off
 *
 * Layout: isolated card centered on a "Notifications" page.
 * The card shows a single Ant Design Segmented control labeled "Email notifications".
 * - Options: "On", "Off"
 * - Initial state: "On" is selected.
 * - Default size, comfortable spacing.
 *
 * A short helper text below reads: "Changes apply immediately." There is no Save/Apply button.
 *
 * Success: The Segmented labeled "Email notifications" has selected value = Off.
 */

import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['On', 'Off'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('On');

  const handleChange = (value: string | number) => {
    const val = String(value);
    setSelected(val);
    if (val === 'Off') {
      onSuccess();
    }
  };

  return (
    <Card title="Notifications" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Email notifications</Text>
      <Segmented
        data-testid="email-notifications"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        options={options}
        value={selected}
        onChange={handleChange}
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12 }}>
        Changes apply immediately.
      </Text>
    </Card>
  );
}
