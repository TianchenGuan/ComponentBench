'use client';

/**
 * combobox_editable_single-mantine-T03: Clear a Mantine Autocomplete field
 *
 * A centered isolated card titled "Tech stack" contains one Mantine Autocomplete
 * input labeled "Framework". The Autocomplete is configured with a clear button.
 * - Scene: isolated_card, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: When the field has a value, a clear button appears in the right section.
 * - Suggestions: React, Angular, Vue, Svelte.
 * - Initial state: value is "Angular".
 * - Distractors: none.
 *
 * Success: The "Framework" combobox value is empty.
 */

import React, { useState } from 'react';
import { Card, Text, Autocomplete, CloseButton } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const frameworks = ['React', 'Angular', 'Vue', 'Svelte'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Angular');

  const handleChange = (newValue: string) => {
    setValue(newValue ?? '');
    if (!newValue || newValue.trim() === '') {
      onSuccess();
    }
  };

  const handleClear = () => {
    setValue('');
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tech stack</Text>
      <Text fw={500} size="sm" mb={8}>Framework</Text>
      <Autocomplete
        data-testid="framework-autocomplete"
        placeholder="Select framework"
        data={frameworks}
        value={value}
        onChange={handleChange}
        rightSection={
          value ? (
            <CloseButton
              aria-label="Clear"
              onClick={handleClear}
              size="sm"
            />
          ) : null
        }
      />
    </Card>
  );
}
