'use client';

/**
 * select_with_search-antd-T03: Clear a preselected size
 *
 * Layout: isolated_card centered titled "Profile".
 * Component: one Ant Design Select labeled "T-shirt size". showSearch is enabled; allowClear is enabled (a clear "x" control appears when the Select has a value).
 * Options: XS, S, Medium, L, XL.
 * Initial state: "Medium" is selected and shown in the Select input.
 * Feedback: clearing removes the displayed value and returns the placeholder text "Select size".
 * No additional inputs, buttons, or toasts are present.
 *
 * Success: The "T-shirt size" Select has no selected option (empty / null value).
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'Medium', label: 'Medium' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>('Medium');

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue === undefined) {
      onSuccess();
    }
  };

  const handleClear = () => {
    setValue(undefined);
    onSuccess();
  };

  return (
    <Card title="Profile" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>T-shirt size</Text>
      <Select
        data-testid="size-select"
        showSearch
        allowClear
        style={{ width: '100%' }}
        placeholder="Select size"
        value={value}
        onChange={handleChange}
        onClear={handleClear}
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Card>
  );
}
