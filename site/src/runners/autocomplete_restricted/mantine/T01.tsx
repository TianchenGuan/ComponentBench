'use client';

/**
 * autocomplete_restricted-mantine-T01: Theme preset select (basic)
 *
 * setup_description:
 * A centered isolated card titled "Appearance" contains one Mantine **Select** labeled **Theme preset**.
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: empty, placeholder "Pick one".
 * - Options (6): Default, Ocean, Forest, Sunset, Lavender, Mono.
 * - This is a restricted select: the stored value must be one of the listed options.
 * - Clicking the input or chevron opens a dropdown; clicking an option commits it and closes the dropdown.
 *
 * No other controls are shown (clutter = none).
 *
 * Success: The "Theme preset" Select has selected value "Ocean".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const themePresets = [
  { label: 'Default', value: 'Default' },
  { label: 'Ocean', value: 'Ocean' },
  { label: 'Forest', value: 'Forest' },
  { label: 'Sunset', value: 'Sunset' },
  { label: 'Lavender', value: 'Lavender' },
  { label: 'Mono', value: 'Mono' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Ocean') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Appearance</Text>
      <Text fw={500} size="sm" mb={4}>Theme preset</Text>
      <Select
        data-testid="theme-preset-select"
        placeholder="Pick one"
        data={themePresets}
        value={value}
        onChange={handleChange}
      />
    </Card>
  );
}
