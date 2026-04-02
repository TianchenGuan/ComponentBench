'use client';

/**
 * select_with_search-antd-T02: Pick a fruit from a short list
 *
 * Layout: isolated_card centered. The card title is "Office snacks".
 * Component: one Ant Design Select labeled "Snack". showSearch is enabled, but the list is short enough to pick without typing.
 * Options: Apple, Banana, Orange, Grapes.
 * Initial state: "Apple" is currently selected and displayed in the Select input.
 * No clear button is shown (allowClear is off). No other controls are on the card.
 *
 * Success: The selected value of the "Snack" Select equals "Banana".
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Apple', label: 'Apple' },
  { value: 'Banana', label: 'Banana' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Grapes', label: 'Grapes' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('Apple');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Banana') {
      onSuccess();
    }
  };

  return (
    <Card title="Office snacks" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Snack</Text>
      <Select
        data-testid="snack-select"
        showSearch
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Card>
  );
}
