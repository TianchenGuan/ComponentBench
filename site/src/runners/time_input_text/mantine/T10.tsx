'use client';

/**
 * time_input_text-mantine-T10: Match a reference clock widget (visual guidance)
 * 
 * Layout: isolated_card anchored toward the bottom-left of the viewport. Light theme, comfortable spacing.
 * The card is titled "Countdown". It contains:
 * - A prominent, stylized digital clock widget (large digits) showing the current target time (e.g., "08:05").
 * - A Mantine TimeInput labeled "Countdown target time" (initially empty).
 * Guidance is visual: the agent must read the time from the clock widget and enter it into the TimeInput.
 * Clutter=low: a small caption under the widget and a non-interactive progress bar.
 * 
 * Success: The TimeInput labeled "Countdown target time" equals the reference clock time (08:05).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Progress, Box } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

const REFERENCE_TIME = '08:05';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === REFERENCE_TIME) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Countdown</Text>
      
      <Stack gap="md">
        {/* Reference clock widget */}
        <Box 
          p="xl" 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <Text 
            c="white" 
            fw={700} 
            style={{ 
              fontSize: 48, 
              fontFamily: 'monospace',
              letterSpacing: 4,
            }}
            data-testid="reference-clock-time"
          >
            {REFERENCE_TIME}
          </Text>
        </Box>
        
        <Text size="xs" c="dimmed" ta="center">Current countdown target</Text>
        
        <Progress value={35} size="sm" />
        
        <div>
          <Text component="label" htmlFor="countdown-target-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Countdown target time
          </Text>
          <TimeInput
            id="countdown-target-time"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            data-testid="countdown-target-time"
          />
        </div>
      </Stack>
    </Card>
  );
}
