'use client';

/**
 * radio_group-mantine-T02: Clock: set time format to 24-hour (small card)
 *
 * A small isolated card is anchored near the bottom-left of the viewport (light theme, default spacing but scale=small so the card and radios are slightly smaller).
 * The card contains one Mantine Radio.Group labeled "Time format" with two options:
 * - 12-hour
 * - 24-hour
 * Initial state: 12-hour is selected.
 * A read-only example time ("Example: 3:45 PM") updates immediately when the selection changes.
 * No other controls are required and there is no Save button.
 *
 * Success: The "Time format" Radio.Group selected value equals "24h" (label "24-hour").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('12h');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === '24h') {
      onSuccess();
    }
  };

  const exampleTime = selected === '24h' ? '15:45' : '3:45 PM';

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 280 }}>
      <Text fw={600} size="sm" mb="sm">Clock settings</Text>
      
      <Radio.Group
        data-canonical-type="radio_group"
        data-selected-value={selected}
        value={selected}
        onChange={handleChange}
        label="Time format"
        size="sm"
      >
        <Stack gap="xs" mt="xs">
          <Radio value="12h" label="12-hour" size="sm" />
          <Radio value="24h" label="24-hour" size="sm" />
        </Stack>
      </Radio.Group>

      <Text size="sm" c="dimmed" mt="md">
        Example: {exampleTime}
      </Text>
    </Card>
  );
}
