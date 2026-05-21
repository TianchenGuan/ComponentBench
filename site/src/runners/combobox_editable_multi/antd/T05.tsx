'use client';

/**
 * combobox_editable_multi-antd-T05: Choose primary interests (two fields)
 *
 * Centered isolated card titled "Profile". The card contains TWO Ant Design Select components in tags mode stacked vertically.
 * - Field 1 label: "Primary interests" (target)
 *   - Starts empty
 * - Field 2 label: "Secondary interests" (distractor)
 *   - Starts with one tag already selected: "Reading"
 * Both fields look visually similar and have their own dropdowns with overlapping options (e.g., Hiking, Photography, Cooking, Travel, Reading, Music, Gaming).
 * The task requires editing ONLY the "Primary interests" field and leaving the "Secondary interests" field unchanged.
 *
 * Success: Primary interests selected values equal {Hiking, Photography, Cooking} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Hiking', label: 'Hiking' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Cooking', label: 'Cooking' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Reading', label: 'Reading' },
  { value: 'Music', label: 'Music' },
  { value: 'Gaming', label: 'Gaming' },
];

const TARGET_SET = ['Hiking', 'Photography', 'Cooking'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<string[]>([]);
  const [secondaryValue, setSecondaryValue] = useState<string[]>(['Reading']);

  useEffect(() => {
    if (setsEqual(primaryValue, TARGET_SET)) {
      onSuccess();
    }
  }, [primaryValue, onSuccess]);

  return (
    <Card title="Profile" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary interests</Text>
        <Select
          data-testid="primary-interests"
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Select interests"
          value={primaryValue}
          onChange={setPrimaryValue}
          options={options}
        />
      </div>
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Secondary interests</Text>
        <Select
          data-testid="secondary-interests"
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Select interests"
          value={secondaryValue}
          onChange={setSecondaryValue}
          options={options}
        />
      </div>
    </Card>
  );
}
