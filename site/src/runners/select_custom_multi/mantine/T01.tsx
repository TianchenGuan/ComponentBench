'use client';

/**
 * select_custom_multi-mantine-T01: Pick two frameworks (React + Svelte)
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Favorite frameworks".
 * Component: Mantine MultiSelect with standard pill (chip) display for selected values.
 * Label: "Frameworks".
 * Options (6): React, Vue, Svelte, Angular, Solid, Ember.
 * Initial state: empty.
 * Clicking the input opens a dropdown below; clicking an option adds a pill immediately (no Save button).
 *
 * Success: The selected values are exactly: React, Svelte (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const frameworkOptions = ['React', 'Vue', 'Svelte', 'Angular', 'Solid', 'Ember'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['React', 'Svelte']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Favorite frameworks</Text>
      <MultiSelect
        data-testid="frameworks-select"
        label="Frameworks"
        placeholder="Select frameworks"
        data={frameworkOptions}
        value={selected}
        onChange={setSelected}
      />
    </Card>
  );
}
