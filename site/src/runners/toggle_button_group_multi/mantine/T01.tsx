'use client';

/**
 * toggle_button_group_multi-mantine-T21: Pick favorite frameworks
 *
 * Layout: isolated_card centered in the viewport.
 *
 * A single card titled "Favorite frameworks" contains a Mantine Chip.Group 
 * configured with multiple selection enabled.
 *
 * Chips (left to right):
 * - React
 * - Angular
 * - Svelte
 * - Vue
 *
 * Initial state:
 * - No chips are selected.
 *
 * Selected chips display Mantine's checked styling (filled background + check mark). 
 * No Apply/Save control and no other clutter.
 *
 * Success: Selected options equal exactly: React, Vue
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Chip, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const FRAMEWORKS = ['React', 'Angular', 'Svelte', 'Vue'];
const TARGET_SET = new Set(['React', 'Vue']);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="sm">Favorite frameworks</Text>
      <Text size="sm" c="dimmed" mb="md">
        Select React and Vue.
      </Text>

      <Chip.Group multiple value={selected} onChange={setSelected} data-testid="frameworks-group">
        <Group gap="sm">
          {FRAMEWORKS.map(fw => (
            <Chip key={fw} value={fw} data-testid={`framework-${fw.toLowerCase()}`}>
              {fw}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Card>
  );
}
