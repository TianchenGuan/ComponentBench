'use client';

/**
 * select_custom_multi-antd-T04: Create a custom tag (Follow-up)
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Ticket labels".
 * One Ant Design Select is configured in tags mode (multi-select + allows custom values).
 * Label: "Labels".
 * Dropdown has three suggestions: Urgent, Normal, Low.
 * Initial state: empty (no tags). Placeholder: "Add labels".
 * Behavior: typing in the input filters suggestions; pressing Enter creates a new tag from the current text if it is not an existing option.
 * No other UI elements are present.
 *
 * Success: The selected values are exactly: Urgent, Follow-up (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const defaultOptions = [
  { label: 'Urgent', value: 'Urgent' },
  { label: 'Normal', value: 'Normal' },
  { label: 'Low', value: 'Low' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    const targetSet = new Set(['Urgent', 'Follow-up']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (values: string[]) => {
    // Add any new values as options
    const newOptions = [...options];
    values.forEach(val => {
      if (!newOptions.find(opt => opt.value === val)) {
        newOptions.push({ label: val, value: val });
      }
    });
    setOptions(newOptions);
    setSelected(values);
  };

  return (
    <Card title="Ticket labels" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Labels</Text>
      <Select
        mode="tags"
        data-testid="labels-select"
        style={{ width: '100%' }}
        placeholder="Add labels"
        value={selected}
        onChange={handleChange}
        options={options}
      />
    </Card>
  );
}
