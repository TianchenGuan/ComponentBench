'use client';

/**
 * icon_button-mantine-T06: Reset sort state to None (cycle ActionIcon)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Sorting" contains one row labeled "Sort order".
 * Clicking cycles: None → A→Z → Z→A → None …
 * Initial state: "A→Z" (data-cb-mode="az").
 * 
 * Success: The sort ActionIcon's canonical mode equals "none".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Group } from '@mantine/core';
import { IconArrowsSort } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

type SortMode = 'none' | 'az' | 'za';

const MODES: SortMode[] = ['none', 'az', 'za'];
const MODE_LABELS: Record<SortMode, string> = {
  none: 'None',
  az: 'A→Z',
  za: 'Z→A',
};

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [mode, setMode] = useState<SortMode>('az'); // Initial state is A→Z

  const handleCycle = () => {
    const currentIndex = MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODES.length;
    const newMode = MODES[nextIndex];
    setMode(newMode);
    
    if (newMode === 'none') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Sorting
      </Text>
      <Group justify="space-between">
        <Text size="sm">Sort order: {MODE_LABELS[mode]}</Text>
        <ActionIcon
          variant="subtle"
          onClick={handleCycle}
          aria-label="Change sort order"
          data-cb-mode={mode}
          data-testid="mantine-action-icon-sort"
        >
          <IconArrowsSort size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
