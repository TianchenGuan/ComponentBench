'use client';

/**
 * select_native-mantine-T03: Reset Language to placeholder (Select language)
 *
 * Layout: a centered isolated card titled "Localization".
 * The target is a Mantine NativeSelect labeled "Language". It is populated using children <option> elements so the first option acts as a placeholder.
 *
 * Options (label → value):
 * - Select language → "" (empty string)  ← TARGET (placeholder/reset)
 * - English → en
 * - Spanish → es
 * - French → fr
 *
 * Initial state: "English" is selected.
 * Feedback: immediate, no confirmation.
 * Distractors: a non-interactive text line "Language affects labels only".
 *
 * Success: The target native select has selected option value '' (label 'Select language').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('en');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === '') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Localization</Text>
      
      <NativeSelect
        data-testid="language-select"
        data-canonical-type="select_native"
        data-selected-value={selected}
        label="Language"
        value={selected}
        onChange={handleChange}
        mb="sm"
      >
        <option value="">Select language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </NativeSelect>

      <Text size="sm" c="dimmed">
        Language affects labels only
      </Text>
    </Card>
  );
}
