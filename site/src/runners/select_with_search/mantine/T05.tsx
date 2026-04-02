'use client';

/**
 * select_with_search-mantine-T05: Pick Helsinki in dark mode with similar names
 *
 * Theme: dark mode styling.
 * Layout: isolated_card centered titled "Conference location".
 * Component: one Mantine Select labeled "City" with searchable enabled.
 * Options include several visually similar strings to increase confusability:
 *  - Helena
 *  - Helsinki ← target
 *  - Hellín
 *  - Hellenic Harbor
 *  - Hamburg
 * Initial state: empty (no selection).
 * Interaction: open dropdown → type to filter → click the exact matching city option; selected value appears in the input.
 *
 * Success: The selected value of the "City" Select equals "Helsinki".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'Helena', label: 'Helena' },
  { value: 'Helsinki', label: 'Helsinki' },
  { value: 'Hellín', label: 'Hellín' },
  { value: 'Hellenic Harbor', label: 'Hellenic Harbor' },
  { value: 'Hamburg', label: 'Hamburg' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Helsinki') {
      onSuccess();
    }
  };

  // Note: Dark theme is handled by ThemeWrapper
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Conference location</Text>
      <Select
        data-testid="city-select"
        label="City"
        placeholder="Select a city"
        searchable
        data={options}
        value={value}
        onChange={handleChange}
      />
    </Card>
  );
}
