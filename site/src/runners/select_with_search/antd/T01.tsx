'use client';

/**
 * select_with_search-antd-T01: Select shipping country: Canada
 *
 * Layout: isolated_card centered in the viewport. The card title is "Shipping address".
 * The card contains a single Ant Design Select labeled "Country" with placeholder "Select a country".
 * Behavior: clicking the Select opens a dropdown (popover) with a search input at the top (showSearch enabled). Typing filters the visible options.
 * Options (single-select): United States, Canada, Mexico, United Kingdom, Germany, Japan.
 * Initial state: no country selected (empty value). No validation errors are shown.
 * No other interactive elements are present on the page (no clutter/distractors).
 *
 * Success: The selected value of the "Country" Select equals "Canada".
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Japan', label: 'Japan' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Canada') {
      onSuccess();
    }
  };

  return (
    <Card title="Shipping address" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Country</Text>
      <Select
        data-testid="country-select"
        showSearch
        style={{ width: '100%' }}
        placeholder="Select a country"
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
