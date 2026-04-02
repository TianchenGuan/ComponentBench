'use client';

/**
 * datetime_picker_single-mantine-T02: Mantine choose a labeled preset
 *
 * Layout: isolated card centered.
 * Component: one Mantine DateTimePicker labeled "Launch slot".
 * Configuration: the picker has a Presets section (a vertical list of buttons) inside the dropdown.
 * Presets (explicit, non-relative):
 *   - "Internal test" → 2026-03-10 08:00
 *   - "Release candidate" → 2026-03-10 09:00
 *   - "General availability" → 2026-03-10 10:00  ← TARGET PRESET
 *   - "Rollback window" → 2026-03-10 11:00
 * Initial state: empty. Selecting a preset immediately sets the datetime value in the input (no separate Apply).
 *
 * Success: The "Launch slot" DateTimePicker equals the preset value for "General availability" (2026-03-10 10:00).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Button, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

const PRESETS = [
  { label: 'Internal test', value: new Date('2026-03-10T08:00:00') },
  { label: 'Release candidate', value: new Date('2026-03-10T09:00:00') },
  { label: 'General availability', value: new Date('2026-03-10T10:00:00') },
  { label: 'Rollback window', value: new Date('2026-03-10T11:00:00') },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD HH:mm') === '2026-03-10 10:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Launch Schedule</Text>
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="dt-launch" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Launch slot
          </Text>
          <DateTimePicker
            id="dt-launch"
            value={value}
            onChange={setValue}
            placeholder="Pick date and time"
            data-testid="dt-launch"
          />
        </div>

        <div>
          <Text size="xs" c="dimmed" mb={8}>Presets:</Text>
          <Group gap="xs">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant={value && dayjs(value).format('YYYY-MM-DD HH:mm') === dayjs(preset.value).format('YYYY-MM-DD HH:mm') ? 'filled' : 'light'}
                size="xs"
                onClick={() => setValue(preset.value)}
                data-testid={`preset-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {preset.label}
              </Button>
            ))}
          </Group>
        </div>
      </Stack>
    </Card>
  );
}
