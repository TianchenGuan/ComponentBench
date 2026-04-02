'use client';

/**
 * select_custom_single-mantine-T02: Clear the Office selection with the clear button
 *
 * Layout: centered isolated card titled "Work profile".
 * The card contains one Mantine Select labeled "Office".
 *
 * Configuration: clearable=true, so a clear (×) button appears in the right section when a value is selected.
 * Initial state: the value is "New York". Placeholder is "Pick an office".
 *
 * Opening the dropdown would show options: New York, London, Berlin, Tokyo, but this task is to clear the selection.
 *
 * Feedback: clicking the clear button immediately removes the selected value and shows the placeholder.
 * No other interactive elements are present.
 *
 * Success: The Mantine Select labeled "Office" has no selected value (cleared / null).
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'New York', label: 'New York' },
  { value: 'London', label: 'London' },
  { value: 'Berlin', label: 'Berlin' },
  { value: 'Tokyo', label: 'Tokyo' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('New York');

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === null) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Work profile</Text>
      <Select
        data-testid="office-select"
        label="Office"
        placeholder="Pick an office"
        data={options}
        value={value}
        onChange={handleChange}
        clearable
      />
    </Card>
  );
}
