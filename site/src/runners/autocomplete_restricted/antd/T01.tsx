'use client';

/**
 * autocomplete_restricted-antd-T01: Country select (basic)
 *
 * setup_description:
 * You are on a simple "Travel Preferences" card placed in the center of the page (no surrounding navigation).
 *
 * The card contains a single Ant Design Select component labeled **Country** with placeholder text "Select a country".
 * - Theme: light; spacing: comfortable; size: default.
 * - The select is closed initially. Clicking the field opens a dropdown popover.
 * - The dropdown contains a short list of 8 countries: United States, Canada, Mexico, Brazil, United Kingdom, France, Germany, Japan.
 * - This is a restricted selector: you may type to filter, but the final value must be chosen from the list (free text is not accepted as the stored value).
 * - There is no "Save/Apply" button; selection commits immediately and the chosen country appears as the field value.
 *
 * There are no other inputs or buttons on the page (clutter = none).
 *
 * Success: The "Country" Select has selected value "Canada".
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const countries = [
  { label: 'United States', value: 'United States' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Japan', value: 'Japan' },
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
    <Card title="Travel Preferences" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Country</Text>
      <Select
        data-testid="country-select"
        style={{ width: '100%' }}
        placeholder="Select a country"
        value={value}
        onChange={handleChange}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={countries}
      />
    </Card>
  );
}
