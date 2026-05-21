'use client';

/**
 * select_custom_single-mantine-T03: Search and select Berlin
 *
 * Layout: centered isolated card titled "Travel profile".
 * The card contains one Mantine Select labeled "City".
 *
 * Configuration: searchable=true. When the dropdown is opened, a search input is available and filters options.
 * The option list contains 8 cities: New York, London, Berlin, Paris, Rome, Tokyo, Sydney, Toronto.
 *
 * Initial state: no city selected (placeholder "Pick a city").
 *
 * Feedback: selecting a city immediately sets the value in the input and closes the dropdown.
 * No other controls are present.
 *
 * Success: The Mantine Select labeled "City" has selected value exactly "Berlin".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const cities = [
  { value: 'New York', label: 'New York' },
  { value: 'London', label: 'London' },
  { value: 'Berlin', label: 'Berlin' },
  { value: 'Paris', label: 'Paris' },
  { value: 'Rome', label: 'Rome' },
  { value: 'Tokyo', label: 'Tokyo' },
  { value: 'Sydney', label: 'Sydney' },
  { value: 'Toronto', label: 'Toronto' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Berlin') {
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
        data={cities}
        value={value}
        onChange={handleChange}
        searchable
      />
    </Card>
  );
}
