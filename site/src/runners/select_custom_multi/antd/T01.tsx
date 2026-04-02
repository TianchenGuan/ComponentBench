'use client';

/**
 * select_custom_multi-antd-T01: Pick two fruits (Apple + Banana)
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered in the viewport. The card title is "Snack basket".
 * The card contains a single Ant Design Select configured as a multi-select in tags-style display (selected items show as removable tags inside the input).
 * Label above the control: "Tags".
 * When you click the input, a dropdown menu opens below it with 6 fruit options: Apple, Banana, Cherry, Grape, Mango, Orange.
 * Initial state: no tags selected; the placeholder reads "Choose fruits".
 * No other interactive components are present (clutter: none). Selection is applied immediately when an option is clicked; there is no separate Apply/OK button.
 *
 * Success: The selected values are exactly: Apple, Banana (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Banana', value: 'Banana' },
  { label: 'Cherry', value: 'Cherry' },
  { label: 'Grape', value: 'Grape' },
  { label: 'Mango', value: 'Mango' },
  { label: 'Orange', value: 'Orange' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Apple', 'Banana']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Snack basket" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags</Text>
      <Select
        mode="multiple"
        data-testid="tags-select"
        style={{ width: '100%' }}
        placeholder="Choose fruits"
        value={selected}
        onChange={setSelected}
        options={options}
      />
    </Card>
  );
}
