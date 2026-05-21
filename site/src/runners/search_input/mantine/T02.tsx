'use client';

/**
 * search_input-mantine-T02: Mantine Autocomplete: choose a suggestion (small list)
 *
 * Baseline isolated card centered in the viewport titled "Tech stack".
 * Contains one Mantine Autocomplete labeled "Framework" with placeholder "Pick value or enter anything".
 * Suggestions dataset has 5 items: React, Angular, Vue, Svelte, Solid.
 * Initial state: empty; suggestions appear as a dropdown when the input is focused/typed.
 * Feedback: after selection, a line shows "Selected framework: React".
 * No other inputs.
 *
 * Success: The Mantine Autocomplete labeled "Framework" has selected_option and value equal to "React".
 */

import React, { useState, useRef } from 'react';
import { Card, Autocomplete, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const frameworks = ['React', 'Angular', 'Vue', 'Svelte', 'Solid'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'React' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tech stack</Text>
      <Autocomplete
        label="Framework"
        placeholder="Pick value or enter anything"
        data={frameworks}
        value={value}
        onChange={handleChange}
        data-testid="search-framework"
      />
      {value && (
        <Text size="sm" c="dimmed" mt="sm">
          Selected framework: {value}
        </Text>
      )}
    </Card>
  );
}
