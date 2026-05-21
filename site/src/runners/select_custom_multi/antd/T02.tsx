'use client';

/**
 * select_custom_multi-antd-T02: Add Push notification channel
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered in the viewport titled "Alerts".
 * There is one Ant Design Select configured for multi-select (tags display). Label: "Notification channels".
 * Dropdown options: Email, SMS, Push, In-app.
 * Initial state: Email is already selected (shown as a tag). The input is otherwise empty.
 * The dropdown opens on click and closes when you click outside. Changes apply immediately; there is no Save/Apply.
 * No distractors are present.
 *
 * Success: The selected values are exactly: Email, Push (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Email', value: 'Email' },
  { label: 'SMS', value: 'SMS' },
  { label: 'Push', value: 'Push' },
  { label: 'In-app', value: 'In-app' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Email']);

  useEffect(() => {
    const targetSet = new Set(['Email', 'Push']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Alerts" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Notification channels</Text>
      <Select
        mode="multiple"
        data-testid="notification-channels-select"
        style={{ width: '100%' }}
        placeholder="Select channels"
        value={selected}
        onChange={setSelected}
        options={options}
      />
    </Card>
  );
}
