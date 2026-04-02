'use client';

/**
 * radio_group-mantine-T03: Layout density: choose the card that matches the example (Radio.Card)
 *
 * A centered isolated card titled "Layout" uses Mantine's Radio.Group with custom Radio.Card items (each card has role="radio").
 * The group label is "Layout density". Three card-style options are shown as clickable tiles with a title and a tiny schematic preview:
 * - Compact
 * - Cozy
 * - Spacious
 * At the top of the card, a non-interactive "Example" tile shows the desired density with both a schematic and the text "Example: Compact".
 * Initial state: Cozy is selected.
 * Selecting a card updates the checked outline and updates a read-only line ("Current density: …") immediately. No Save button.
 *
 * Success: The "Layout density" Radio.Group selected value equals "compact" (label "Compact").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Group, Box, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Compact', value: 'compact', lines: 4, gap: 2 },
  { label: 'Cozy', value: 'cozy', lines: 3, gap: 4 },
  { label: 'Spacious', value: 'spacious', lines: 2, gap: 6 },
];

function DensityPreview({ lines, gap }: { lines: number; gap: number }) {
  return (
    <Box style={{ width: 40, height: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 3, background: '#aaa', borderRadius: 1 }} />
      ))}
    </Box>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('cozy');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === 'compact') {
      onSuccess();
    }
  };

  const selectedLabel = options.find(o => o.value === selected)?.label || '';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="lg" mb="md">Layout</Text>

      {/* Example tile */}
      <Box 
        style={{ 
          padding: 12, 
          background: '#e7f5ff', 
          borderRadius: 8, 
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        <DensityPreview lines={4} gap={2} />
        <Text size="sm" fw={500}>Example: Compact</Text>
      </Box>

      <Radio.Group
        data-canonical-type="radio_group"
        data-selected-value={selected}
        value={selected}
        onChange={handleChange}
        label="Layout density"
      >
        <Group gap="md" mt="xs">
          {options.map(option => (
            <Card
              key={option.value}
              shadow="xs"
              padding="sm"
              radius="md"
              withBorder
              style={{ 
                cursor: 'pointer',
                borderColor: selected === option.value ? '#228be6' : undefined,
                borderWidth: selected === option.value ? 2 : 1,
              }}
              onClick={() => handleChange(option.value)}
              role="radio"
              aria-checked={selected === option.value}
            >
              <Stack gap={4} align="center">
                <DensityPreview lines={option.lines} gap={option.gap} />
                <Radio value={option.value} label={option.label} styles={{ radio: { display: 'none' } }} />
                <Text size="xs">{option.label}</Text>
              </Stack>
            </Card>
          ))}
        </Group>
      </Radio.Group>

      <Text size="sm" c="dimmed" mt="md">
        Current density: {selectedLabel}
      </Text>
    </Card>
  );
}
