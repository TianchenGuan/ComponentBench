'use client';

/**
 * select_custom_single-mantine-T01: Set Favorite framework to Vue
 *
 * Layout: centered isolated card titled "Preferences".
 * The card contains one Mantine Select labeled "Favorite framework", default size, comfortable spacing.
 *
 * Initial state: value is "React".
 * Opening the select shows a dropdown list with four options: React, Angular, Vue, Svelte.
 *
 * Feedback: selecting an option immediately updates the input display; no Apply/OK button.
 * No other controls are present.
 *
 * Success: The Mantine Select labeled "Favorite framework" has selected value exactly "Vue".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'React', label: 'React' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Vue', label: 'Vue' },
  { value: 'Svelte', label: 'Svelte' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('React');

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Vue') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Preferences</Text>
      <Select
        data-testid="framework-select"
        label="Favorite framework"
        data={options}
        value={value}
        onChange={handleChange}
      />
    </Card>
  );
}
