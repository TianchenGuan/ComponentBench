'use client';

/**
 * time_picker-mantine-T01: Select 09:30 from presets (daily standup)
 *
 * A centered isolated card contains one time picker labeled "Daily standup".
 * The value is empty initially. The component shows preset buttons for quick selection.
 * Selecting a preset immediately sets the value.
 *
 * Implementation: Using TimeInput with preset buttons for Mantine (since Mantine lacks built-in TimePicker with presets)
 *
 * Success: The time picker labeled "Daily standup" has canonical time value exactly 09:30 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

const PRESETS = ['09:00', '09:30', '10:00'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '09:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Meeting Schedule</Text>
      
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="tp-standup" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Daily standup
          </Text>
          <TimeInput
            id="tp-standup"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            data-testid="tp-standup"
          />
        </div>

        <div>
          <Text size="xs" c="dimmed" mb={8}>Presets:</Text>
          <Group gap="xs">
            {PRESETS.map((preset) => (
              <Button
                key={preset}
                variant={value === preset ? 'filled' : 'light'}
                size="xs"
                onClick={() => setValue(preset)}
                data-testid={`preset-${preset}`}
              >
                {preset}
              </Button>
            ))}
          </Group>
        </div>

        <Text size="xs" c="dimmed">
          (Select 09:30)
        </Text>
      </Stack>
    </Card>
  );
}
