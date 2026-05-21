'use client';

/**
 * radio_group-antd-T02: Profile: set visibility to Private
 *
 * An isolated settings card is anchored near the top-left of the viewport (light theme, comfortable spacing).
 * The card section "Profile visibility" contains one Ant Design Radio.Group with three options laid out in a single column:
 * - Public
 * - Private
 * - Friends only
 * Initial state: "Public" is selected.
 * A small helper text under the group says "Controls who can see your profile." The helper text is not interactive.
 * No other radio groups exist on the page and no confirmation is required; changing the selection updates an inline status tag immediately.
 *
 * Success: The "Profile visibility" Radio.Group selected value equals "private" (label "Private").
 */

import React, { useState } from 'react';
import { Card, Radio, Typography, Tag, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'Friends only', value: 'friends_only' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('public');

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setSelected(value);
    if (value === 'private') {
      onSuccess();
    }
  };

  const selectedLabel = options.find(o => o.value === selected)?.label || '';

  return (
    <Card title="Profile visibility" style={{ width: 360 }}>
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
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Controls who can see your profile.
      </div>
      <div style={{ marginTop: 12 }}>
        <Tag color={selected === 'private' ? 'blue' : 'default'}>{selectedLabel}</Tag>
      </div>
    </Card>
  );
}
