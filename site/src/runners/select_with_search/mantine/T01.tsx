'use client';

/**
 * select_with_search-mantine-T01: Set priority to Low
 *
 * Layout: isolated_card centered titled "Task".
 * Component: one Mantine Select labeled "Priority" with searchable enabled, but only three options are provided.
 * Options: Low, Medium, High.
 * Initial state: "Medium" is selected.
 * Interaction: clicking the Select opens a dropdown; clicking an option updates the value immediately.
 * No other interactive elements are present.
 *
 * Success: The selected value of the "Priority" Select equals "Low".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Medium');

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Low') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Task</Text>
      <Select
        data-testid="priority-select"
        label="Priority"
        searchable
        data={options}
        value={value}
        onChange={handleChange}
      />
    </Card>
  );
}
