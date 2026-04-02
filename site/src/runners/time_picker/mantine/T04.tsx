'use client';

/**
 * time_picker-mantine-T04: Set End time to 17:45 (two Mantine pickers)
 *
 * The page shows a form section titled "Event schedule" in the center. It contains a few non-target fields
 * (event name, location) creating low clutter. There are two Mantine TimeInput components labeled "Start time" and "End
 * time". Start time begins at 09:00; End time begins at 17:00. The task targets the End time instance only.
 *
 * Scene: layout=form_section, instances=2, clutter=low
 *
 * Success: The TimeInput labeled "End time" has canonical time value exactly 17:45 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TextInput, Stack, Group, Box } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  useEffect(() => {
    if (endTime === '17:45') {
      onSuccess();
    }
  }, [endTime, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Event schedule</Text>
      
      <Stack gap="md">
        {/* Clutter fields */}
        <TextInput label="Event name" placeholder="Enter event name" />
        <TextInput label="Location" placeholder="Enter location" />

        {/* Target fields */}
        <Group grow>
          <Box>
            <Text component="label" htmlFor="mantine-tp-start" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Start time
            </Text>
            <TimeInput
              id="mantine-tp-start"
              value={startTime}
              onChange={(event) => setStartTime(event.currentTarget.value)}
              data-testid="mantine-tp-start"
            />
          </Box>
          <Box>
            <Text component="label" htmlFor="mantine-tp-end" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              End time
            </Text>
            <TimeInput
              id="mantine-tp-end"
              value={endTime}
              onChange={(event) => setEndTime(event.currentTarget.value)}
              data-testid="mantine-tp-end"
            />
          </Box>
        </Group>

        <Text size="xs" c="dimmed">
          (Set End time to 17:45)
        </Text>
      </Stack>
    </Card>
  );
}
