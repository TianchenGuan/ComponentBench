'use client';

/**
 * select_custom_multi-mantine-T05: Match interests from a visual reference
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=visual, clutter=low.
 * Layout: isolated card centered titled "Interest picker".
 * At the top of the card there is a non-interactive "Target interests" row showing the desired interests as three pills (visual reference).
 * Below it is the Mantine MultiSelect labeled "Interests".
 * Options (11): Hiking, Cooking, Photography, Reading, Travel, Music, Movies, Fitness, Gaming, Gardening, Running.
 * Initial state: Interests is empty.
 * No Save button; selecting options adds pills immediately.
 *
 * Success: The selected values are exactly: Hiking, Cooking, Photography (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect, Badge, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const interestOptions = [
  'Hiking', 'Cooking', 'Photography', 'Reading', 'Travel',
  'Music', 'Movies', 'Fitness', 'Gaming', 'Gardening', 'Running'
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Hiking', 'Cooking', 'Photography']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Interest picker</Text>
      
      <Box mb="md" p="sm" style={{ background: '#f5f5f5', borderRadius: 4 }}>
        <Text size="xs" c="dimmed" mb="xs">Target interests</Text>
        <Group gap="xs">
          <Badge variant="light">Hiking</Badge>
          <Badge variant="light">Cooking</Badge>
          <Badge variant="light">Photography</Badge>
        </Group>
      </Box>

      <MultiSelect
        data-testid="interests-select"
        label="Interests"
        placeholder="Select interests"
        data={interestOptions}
        value={selected}
        onChange={setSelected}
      />
    </Card>
  );
}
