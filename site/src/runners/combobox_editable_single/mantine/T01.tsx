'use client';

/**
 * combobox_editable_single-mantine-T01: Pick Svelte from Autocomplete suggestions
 *
 * A centered isolated card titled "Profile" contains one editable combobox
 * labeled "Favorite library" implemented with Mantine Autocomplete.
 * - Scene: isolated_card layout, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: Typing opens a dropdown with suggestions; clicking a suggestion fills the input.
 * - Suggestions: React, Angular, Vue, Svelte, Solid, Ember.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Favorite library" combobox value equals "Svelte".
 */

import React, { useState } from 'react';
import { Card, Text, Autocomplete } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const libraries = ['React', 'Angular', 'Vue', 'Svelte', 'Solid', 'Ember'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Svelte') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Profile</Text>
      <Text fw={500} size="sm" mb={8}>Favorite library</Text>
      <Autocomplete
        data-testid="favorite-library"
        placeholder="Select library"
        data={libraries}
        value={value}
        onChange={handleChange}
      />
    </Card>
  );
}
