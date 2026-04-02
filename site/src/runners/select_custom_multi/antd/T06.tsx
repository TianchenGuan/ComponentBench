'use client';

/**
 * select_custom_multi-antd-T06: Match the badge chips from the preview
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=visual, clutter=low.
 * Layout: isolated card centered titled "Badge builder".
 * At the top of the card there is a non-interactive "Target selection" preview row that displays the desired badges as three colored chips.
 * Below the preview is the interactive Ant Design multi-select (tags display) labeled "Badges".
 * Dropdown options (9 total): Gold, Silver, Bronze, Platinum, Copper, Gold (legacy), Silver (trial), Bronze (archived), Member.
 * Initial state: the Badges field is empty.
 * Selecting options adds tags to the input immediately. No Save/Apply button.
 *
 * Success: The selected values are exactly: Gold, Silver, Bronze (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Gold', value: 'Gold' },
  { label: 'Silver', value: 'Silver' },
  { label: 'Bronze', value: 'Bronze' },
  { label: 'Platinum', value: 'Platinum' },
  { label: 'Copper', value: 'Copper' },
  { label: 'Gold (legacy)', value: 'Gold (legacy)' },
  { label: 'Silver (trial)', value: 'Silver (trial)' },
  { label: 'Bronze (archived)', value: 'Bronze (archived)' },
  { label: 'Member', value: 'Member' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Gold', 'Silver', 'Bronze']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Badge builder" style={{ width: 450 }}>
      <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Target selection</Text>
        <Space size={8}>
          <Tag color="gold">Gold</Tag>
          <Tag color="default">Silver</Tag>
          <Tag color="orange">Bronze</Tag>
        </Space>
      </div>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Badges</Text>
      <Select
        mode="multiple"
        data-testid="badges-select"
        style={{ width: '100%' }}
        placeholder="Select badges"
        value={selected}
        onChange={setSelected}
        options={options}
      />
    </Card>
  );
}
