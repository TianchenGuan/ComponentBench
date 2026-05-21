'use client';

/**
 * select_native-mantine-T01: Pick Svelte as favorite framework (basic)
 *
 * Layout: a centered isolated card titled "Quick survey".
 * The card contains a single Mantine NativeSelect labeled "Favorite framework".
 *
 * Options (label → value):
 * - React → react
 * - Angular → angular
 * - Svelte → svelte  ← TARGET
 * - Vue → vue
 *
 * Initial state: "React" is selected.
 * No other interactive elements besides a decorative "Why we ask" info icon (non-clickable).
 * Feedback: the selected label is visible in the field immediately; no confirmation button.
 *
 * Success: The target native select has selected option value 'svelte' (label 'Svelte').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Vue', value: 'vue' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('react');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'svelte') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Quick survey</Text>
        <IconInfoCircle size={20} color="#aaa" style={{ cursor: 'default' }} />
      </Group>
      
      <NativeSelect
        data-testid="favorite-framework-select"
        data-canonical-type="select_native"
        data-selected-value={selected}
        label="Favorite framework"
        value={selected}
        onChange={handleChange}
        data={options}
      />
    </Card>
  );
}
