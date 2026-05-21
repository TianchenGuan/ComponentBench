'use client';

/**
 * segmented_control-mantine-T06: View mode → match highlighted preview tile
 *
 * Layout: isolated card titled "Choose a view".
 * At the top of the card, three preview tiles are shown (List, Grid, Cards). Exactly one tile is highlighted with an outline.
 * Under the tiles is a Mantine SegmentedControl labeled "View mode" with text options:
 * "List", "Grid", "Cards".
 *
 * Initial state: "List" is selected.
 * No Apply button; selection is immediate.
 *
 * Clutter (low): short hint text "Pick the view shown above."
 *
 * Success: The "View mode" SegmentedControl selection matches the highlighted preview tile.
 * (Preview highlights Cards)
 */

import React, { useState } from 'react';
import { Card, Text, Group, Box, SegmentedControl } from '@mantine/core';
import { IconList, IconGridDots, IconLayoutCards } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

// Preview highlights Cards
const PREVIEW_HIGHLIGHT = 'Cards';

const viewOptions = [
  { value: 'List', icon: IconList },
  { value: 'Grid', icon: IconGridDots },
  { value: 'Cards', icon: IconLayoutCards },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('List');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === PREVIEW_HIGHLIGHT) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Choose a view</Text>
      
      {/* Preview tiles */}
      <Group gap="sm" mb="xs" data-testid="view-preview" data-highlighted={PREVIEW_HIGHLIGHT}>
        {viewOptions.map(opt => {
          const Icon = opt.icon;
          const isHighlighted = opt.value === PREVIEW_HIGHLIGHT;
          return (
            <Box
              key={opt.value}
              style={{
                width: 64,
                height: 48,
                border: isHighlighted ? '2px solid #228be6' : '1px solid #dee2e6',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa',
              }}
            >
              <Icon size={20} color={isHighlighted ? '#228be6' : '#868e96'} />
            </Box>
          );
        })}
      </Group>
      <Text size="xs" c="dimmed" mb="md">Pick the view shown above.</Text>

      <Text fw={500} mb="xs">View mode</Text>
      <SegmentedControl
        data-testid="view-mode"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        data={viewOptions.map(o => o.value)}
        value={selected}
        onChange={handleChange}
      />
    </Card>
  );
}
