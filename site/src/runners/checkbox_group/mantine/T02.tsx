'use client';

/**
 * checkbox_group-mantine-T02: Set newsletter frequency to Monthly only
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Mantine page with a single isolated card titled "Email settings".
 * One Checkbox.Group labeled "Newsletter frequency" contains:
 * Daily (unchecked), Weekly (checked by default), Monthly (unchecked).
 * Success: In the 'Newsletter frequency' checkbox group, only Monthly is checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = ['Daily', 'Weekly', 'Monthly'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Weekly']);

  useEffect(() => {
    const targetSet = new Set(['Monthly']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Email settings</Text>
      <Text fw={500} size="sm" mb="xs">Newsletter frequency</Text>
      <Checkbox.Group
        data-testid="cg-newsletter-frequency"
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
