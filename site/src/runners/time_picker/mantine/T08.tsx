'use client';

/**
 * time_picker-mantine-T08: Set Evening cutoff to 20:55 on a dashboard (3 instances)
 *
 * A dashboard-style page contains multiple cards, filters, and status chips (high clutter). 
 * Three Mantine TimeInput components appear: "Morning cutoff", "Afternoon cutoff", and "Evening cutoff". 
 * The Evening cutoff picker starts at 20:00. The task requires changing only the "Evening cutoff" instance.
 *
 * Scene: layout=dashboard, placement=top_right, instances=3, clutter=high
 *
 * Success: The TimeInput labeled "Evening cutoff" has canonical time value exactly 20:55 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Group, Badge, Stack, Chip } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [morningCutoff, setMorningCutoff] = useState('06:00');
  const [afternoonCutoff, setAfternoonCutoff] = useState('14:00');
  const [eveningCutoff, setEveningCutoff] = useState('20:00');

  useEffect(() => {
    if (eveningCutoff === '20:55') {
      onSuccess();
    }
  }, [eveningCutoff, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Operations dashboard</Text>
        <Group gap="xs">
          <Badge color="green" variant="light">Live</Badge>
          <Badge color="blue" variant="light">Q1 2026</Badge>
        </Group>
      </Group>

      {/* Clutter: status chips */}
      <Group gap="xs" mb="md">
        <Chip defaultChecked variant="light" size="xs">All regions</Chip>
        <Chip variant="light" size="xs">USA</Chip>
        <Chip variant="light" size="xs">Europe</Chip>
        <Chip variant="light" size="xs">Asia</Chip>
      </Group>

      <Stack gap="sm">
        {/* Morning cutoff */}
        <Box>
          <Text component="label" htmlFor="tp-cutoff-morning" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Morning cutoff
          </Text>
          <TimeInput
            id="tp-cutoff-morning"
            value={morningCutoff}
            onChange={(event) => setMorningCutoff(event.currentTarget.value)}
            data-testid="tp-cutoff-morning"
          />
        </Box>

        {/* Afternoon cutoff */}
        <Box>
          <Text component="label" htmlFor="tp-cutoff-afternoon" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Afternoon cutoff
          </Text>
          <TimeInput
            id="tp-cutoff-afternoon"
            value={afternoonCutoff}
            onChange={(event) => setAfternoonCutoff(event.currentTarget.value)}
            data-testid="tp-cutoff-afternoon"
          />
        </Box>

        {/* Evening cutoff */}
        <Box>
          <Text component="label" htmlFor="tp-cutoff-evening" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Evening cutoff
          </Text>
          <TimeInput
            id="tp-cutoff-evening"
            value={eveningCutoff}
            onChange={(event) => setEveningCutoff(event.currentTarget.value)}
            data-testid="tp-cutoff-evening"
          />
        </Box>
      </Stack>

      <Text size="xs" c="dimmed" mt="md">
        (Set Evening cutoff to 20:55)
      </Text>
    </Card>
  );
}
