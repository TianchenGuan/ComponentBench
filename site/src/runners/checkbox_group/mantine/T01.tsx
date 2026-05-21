'use client';

/**
 * checkbox_group-mantine-T01: Select Spanish and French (Languages)
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Mantine core demo page (light theme) with a centered isolated card titled "Profile".
 * The card contains one Checkbox.Group labeled "Languages" with three options:
 * English, Spanish, French.
 * Initial state: none selected. No submit button; state updates immediately.
 * Success: The 'Languages' checkbox group has Spanish and French checked, and English unchecked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = ['English', 'Spanish', 'French'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Spanish', 'French']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Profile</Text>
      <Text fw={500} size="sm" mb="xs">Languages</Text>
      <Checkbox.Group
        data-testid="cg-languages"
        value={selected}
        onChange={setSelected}
      >
        <Stack gap="xs">
          {options.map(option => (
            <Checkbox key={option} value={option} label={option} />
          ))}
        </Stack>
      </Checkbox.Group>
    </Card>
  );
}
