'use client';

/**
 * radio_group-mantine-T08: Notifications: match the reference style in dark mode (Radio.Card)
 *
 * A centered isolated card titled "Notification style" is rendered in dark theme.
 * At the top-right of the card is a non-interactive reference mock notification showing a wide banner message across the top (no text label saying "Banner").
 * Below is a Mantine Radio.Group implemented with Radio.Card tiles (each tile is a clickable card with an icon and a short label). Options:
 * - Silent
 * - Dot
 * - Badge
 * - Banner
 * - Pop-up
 * Initial state: Dot is selected.
 * Selecting a tile immediately updates a larger preview area below; no Save button.
 * Icons and dark theme reduce contrast and increase the reliance on correct tile selection.
 *
 * Success: The selected value in the "Notification style" Radio.Group equals "banner" (label "Banner").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Group, Box, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Silent', value: 'silent', icon: '🔇' },
  { label: 'Dot', value: 'dot', icon: '🔴' },
  { label: 'Badge', value: 'badge', icon: '🏷️' },
  { label: 'Banner', value: 'banner', icon: '📢' },
  { label: 'Pop-up', value: 'popup', icon: '💬' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('dot');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === 'banner') {
      onSuccess();
    }
  };

  const selectedLabel = options.find(o => o.value === selected)?.label || '';

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      style={{ 
        width: 480, 
        background: '#1a1b1e',
        border: '1px solid #373a40'
      }}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <Text fw={600} size="lg" c="white">Notification style</Text>
        
        {/* Reference mock notification (banner style) */}
        <Box style={{ 
          width: 100, 
          height: 24, 
          background: '#228be6',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text size="xs" c="white">New message</Text>
        </Box>
      </Group>

      <Radio.Group
        data-canonical-type="radio_group"
        data-selected-value={selected}
        value={selected}
        onChange={handleChange}
      >
        <Group gap="sm">
          {options.map(option => (
            <Card
              key={option.value}
              shadow="xs"
              padding="sm"
              radius="md"
              style={{ 
                cursor: 'pointer',
                background: selected === option.value ? '#25262b' : '#2c2e33',
                border: selected === option.value ? '2px solid #228be6' : '1px solid #373a40',
                minWidth: 70,
              }}
              onClick={() => handleChange(option.value)}
              role="radio"
              aria-checked={selected === option.value}
            >
              <Stack gap={4} align="center">
                <Text size="xl">{option.icon}</Text>
                <Radio 
                  value={option.value} 
                  label="" 
                  styles={{ radio: { display: 'none' } }} 
                />
                <Text size="xs" c="dimmed">{option.label}</Text>
              </Stack>
            </Card>
          ))}
        </Group>
      </Radio.Group>

      {/* Preview area */}
      <Box style={{ 
        marginTop: 16, 
        height: 80, 
        background: '#25262b',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text size="sm" c="dimmed">Preview: {selectedLabel}</Text>
      </Box>
    </Card>
  );
}
