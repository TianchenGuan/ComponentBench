'use client';

/**
 * combobox_editable_single-mantine-T10: Set Build standard to C++17 (special characters, small control)
 *
 * A small settings card titled "Compiler" is anchored near the bottom-right of the viewport.
 * It contains one Mantine Autocomplete input labeled "Build standard".
 * - Scene: isolated_card layout, bottom_right placement, light theme, COMPACT spacing, SMALL scale.
 * - Component behavior: The field shows suggestions as you type but also accepts free text.
 * - Suggestions: C, C++, C++14, C++17, C++20, C#.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Build standard" combobox value equals the exact string "C++17".
 */

import React, { useState } from 'react';
import { Card, Text, Autocomplete } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const buildStandards = ['C', 'C++', 'C++14', 'C++17', 'C++20', 'C#'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'C++17') {
      onSuccess();
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="sm" 
      radius="md" 
      withBorder 
      style={{ width: 280 }}
    >
      <Text fw={600} size="sm" mb="sm">Compiler</Text>
      <Text fw={500} size="xs" mb={4}>Build standard</Text>
      <Autocomplete
        data-testid="build-standard"
        placeholder="Enter standard"
        data={buildStandards}
        value={value}
        onChange={handleChange}
        size="xs"
      />
      <Text size="xs" c="dimmed" mt={8}>Goal: C++17</Text>
    </Card>
  );
}
