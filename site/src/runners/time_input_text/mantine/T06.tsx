'use client';

/**
 * time_input_text-mantine-T06: Match the time shown on a sample event card
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * The card is titled "Event editor" and contains:
 * - A small "Sample event" preview card showing a bold time label "18:10".
 * - One Mantine TimeInput labeled "Event time" (initially empty).
 * The preview card is informational; only the TimeInput value determines success.
 * Clutter=low: includes the preview card and a short helper caption.
 * 
 * Success: The TimeInput labeled "Event time" equals the reference time (18:10).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Paper, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

const REFERENCE_TIME = '18:10';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === REFERENCE_TIME) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Event editor</Text>
      
      <Stack gap="md">
        {/* Reference card */}
        <Paper p="md" withBorder bg="gray.0">
          <Text size="sm" c="dimmed" mb={4}>Sample event</Text>
          <Text fw={700} size="xl" data-testid="sample-event-time">{REFERENCE_TIME}</Text>
        </Paper>
        
        <Text size="sm" c="dimmed">Match the time shown above.</Text>
        
        <div>
          <Text component="label" htmlFor="event-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Event time
          </Text>
          <TimeInput
            id="event-time"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            data-testid="event-time"
          />
        </div>
      </Stack>
    </Card>
  );
}
