'use client';

/**
 * time_picker-mantine-T07: Match stopwatch time with seconds (dark, compact, small)
 *
 * The page is rendered in a dark theme with compact spacing. A small isolated card is centered and contains
 * a non-interactive stopwatch-style reference display showing "07:07:30". Below it is a Mantine TimeInput labeled "Lap
 * time" that accepts seconds input. The TimeInput uses step="1" for second precision.
 *
 * Scene: theme=dark, spacing=compact, scale=small, guidance=mixed
 *
 * Success: The "Lap time" TimeInput value equals the stopwatch reading, exactly 07:07:30 (HH:mm:ss, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Box, MantineProvider } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '07:07:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 320 }}>
        <Text fw={600} size="md" mb="sm">Stopwatch</Text>
        
        {/* Stopwatch reference display */}
        <Box
          data-testid="stopwatch-reading"
          p="sm"
          mb="md"
          style={{
            background: '#1a1b1e',
            border: '1px solid #373a40',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <Text size="xs" c="dimmed" mb={4}>Stopwatch reading</Text>
          <Text
            size="xl"
            fw={700}
            style={{ fontFamily: 'monospace', color: '#228be6' }}
          >
            07:07:30
          </Text>
        </Box>

        {/* Target picker */}
        <div>
          <Text component="label" htmlFor="tp-lap" fw={500} size="xs" mb={4} style={{ display: 'block' }}>
            Lap time
          </Text>
          <TimeInput
            id="tp-lap"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            withSeconds
            size="sm"
            data-testid="tp-lap"
          />
          <Text size="xs" c="dimmed" mt={8}>
            (Match the stopwatch)
          </Text>
        </div>
      </Card>
    </MantineProvider>
  );
}
