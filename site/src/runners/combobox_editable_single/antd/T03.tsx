'use client';

/**
 * combobox_editable_single-antd-T03: Clear the City field
 *
 * A single isolated card titled "Address" is centered in the viewport.
 * It contains one editable combobox labeled "City" implemented with Ant Design AutoComplete.
 * - Scene: isolated_card, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: The AutoComplete input supports a clear icon when a value is present.
 * - Options: Seattle, San Diego, San Jose, San Francisco, Sacramento, Portland, Phoenix, Denver, Dallas, Austin, Chicago, Boston.
 * - Initial state: input value is "Seattle".
 * - Distractors: none.
 *
 * Success: The value of the "City" combobox is empty.
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Seattle' },
  { value: 'San Diego' },
  { value: 'San Jose' },
  { value: 'San Francisco' },
  { value: 'Sacramento' },
  { value: 'Portland' },
  { value: 'Phoenix' },
  { value: 'Denver' },
  { value: 'Dallas' },
  { value: 'Austin' },
  { value: 'Chicago' },
  { value: 'Boston' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Seattle');

  const handleChange = (newValue: string) => {
    setValue(newValue ?? '');
    if (!newValue || newValue.trim() === '') {
      onSuccess();
    }
  };

  return (
    <Card title="Address" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>City</Text>
      <AutoComplete
        data-testid="city-autocomplete"
        style={{ width: '100%' }}
        options={options}
        placeholder="Enter city"
        value={value}
        onChange={handleChange}
        allowClear
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
    </Card>
  );
}
