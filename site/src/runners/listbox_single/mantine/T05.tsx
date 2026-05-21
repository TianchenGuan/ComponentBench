'use client';

/**
 * listbox_single-mantine-T05: Match the colored dot: choose Violet
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is visual; clutter is none.
 * A centered isolated card titled "Accent color" shows a small reference swatch above the list: a violet dot 🟣.
 * Below it is a NavLink-based listbox with four rows; each row shows a leading color dot and label:
 * "Red" (🔴), "Green" (🟢), "Blue" (🔵), "Violet" (🟣). Only one row is active.
 * Initial active row is "Blue". The goal is specified visually by the reference dot.
 *
 * Success: Selected option value equals: violet (matching 🟣)
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'red', label: 'Red', icon: '🔴' },
  { value: 'green', label: 'Green', icon: '🟢' },
  { value: 'blue', label: 'Blue', icon: '🔵' },
  { value: 'violet', label: 'Violet', icon: '🟣' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('blue');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'violet') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
      <Text fw={600} size="lg" mb="md">Accent color</Text>

      {/* Reference swatch */}
      <Box mb="md" data-cb-reference-swatch>
        <Badge size="lg" variant="light" style={{ fontSize: 18 }}>🟣</Badge>
      </Box>

      <Stack
        gap="xs"
        data-cb-listbox-root
        data-cb-selected-value={selected}
        role="listbox"
      >
        {options.map(opt => (
          <NavLink
            key={opt.value}
            label={opt.label}
            leftSection={<span style={{ fontSize: 16 }}>{opt.icon}</span>}
            active={selected === opt.value}
            onClick={() => handleSelect(opt.value)}
            data-cb-option-value={opt.value}
            role="option"
            aria-selected={selected === opt.value}
          />
        ))}
      </Stack>
    </Card>
  );
}
