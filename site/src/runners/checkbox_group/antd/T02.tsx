'use client';

/**
 * checkbox_group-antd-T02: Switch notification channel to SMS only
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Light theme Ant Design page with one centered card titled "Alert settings".
 * The card contains a single Checkbox.Group labeled "Notification channels" with three options:
 * - Email (checked by default)
 * - SMS (unchecked)
 * - Push (unchecked)
 * Success: The checkbox group 'Notification channels' has SMS checked. Email and Push are unchecked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = ['Email', 'SMS', 'Push'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Email']);

  useEffect(() => {
    const targetSet = new Set(['SMS']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Alert settings" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Notification channels</Text>
      <Checkbox.Group
        data-testid="cg-notification-channels"
        value={selected}
        onChange={(checkedValues) => setSelected(checkedValues as string[])}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map(option => (
            <Checkbox key={option} value={option}>
              {option}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    </Card>
  );
}
