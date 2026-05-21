'use client';

/**
 * select_with_search-mantine-T02: Search and select a city: New York
 *
 * Layout: isolated_card centered titled "Travel profile".
 * Component: one Mantine Select labeled "City" with searchable enabled.
 * Options: New York, Boston, Chicago, Seattle, Miami, Austin.
 * Initial state: empty (placeholder "Pick a city").
 * Interaction: open dropdown → a search field is available to filter options; selecting an option immediately updates the displayed value.
 *
 * Success: The selected value of the "City" Select equals "New York".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'New York', label: 'New York' },
  { value: 'Boston', label: 'Boston' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'Seattle', label: 'Seattle' },
  { value: 'Miami', label: 'Miami' },
  { value: 'Austin', label: 'Austin' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'New York') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Travel profile</Text>
      <Select
        data-testid="city-select"
        label="City"
        placeholder="Pick a city"
        searchable
        data={options}
        value={value}
        onChange={handleChange}
      />
    </Card>
  );
}
