'use client';

/**
 * time_input_text-mantine-T04: Set End time in a Start/End pair (Mantine)
 * 
 * Layout: form_section centered, light theme, comfortable spacing.
 * A section titled "Working hours" contains two Mantine TimeInput fields:
 * - "Start time" (prefilled 09:00)
 * - "End time" (prefilled 16:00)  ← TARGET
 * Both are native input[type='time'] with minute precision (step=60).
 * Clutter=low: a non-required "Include weekends" toggle is present.
 * Only the End time value determines success.
 * 
 * Success: The TimeInput instance labeled "End time" equals 17:30.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Switch, Group, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [startTime] = useState('09:00');
  const [endTime, setEndTime] = useState('16:00');
  const [includeWeekends, setIncludeWeekends] = useState(false);

  useEffect(() => {
    if (endTime === '17:30') {
      onSuccess();
    }
  }, [endTime, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Working hours</Text>
      
      <Stack gap="md">
        <Group grow>
          <div>
            <Text component="label" htmlFor="start-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Start time
            </Text>
            <TimeInput
              id="start-time"
              value={startTime}
              readOnly
              data-testid="start-time"
            />
          </div>
          <div>
            <Text component="label" htmlFor="end-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              End time
            </Text>
            <TimeInput
              id="end-time"
              value={endTime}
              onChange={(event) => setEndTime(event.currentTarget.value)}
              data-testid="end-time"
            />
          </div>
        </Group>
        
        <Switch
          label="Include weekends"
          checked={includeWeekends}
          onChange={(event) => setIncludeWeekends(event.currentTarget.checked)}
        />
      </Stack>
    </Card>
  );
}
