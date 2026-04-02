'use client';

/**
 * listbox_single-mantine-T01: Workspace theme: choose Ocean
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered isolated card titled "Workspace theme" contains a vertical listbox built from Mantine NavLink
 * components inside a Stack. Each row is a NavLink with only a label: "Sand", "Forest", "Ocean", "Mono".
 * Exactly one row is active at a time; the active row is visually highlighted using NavLink's active styling.
 * Initial active selection is "Sand". No other interactive controls appear on the page.
 *
 * Success: Selected option value equals: ocean
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'sand', label: 'Sand' },
  { value: 'forest', label: 'Forest' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'mono', label: 'Mono' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('sand');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'ocean') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
      <Text fw={600} size="lg" mb="md">Workspace theme</Text>

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
