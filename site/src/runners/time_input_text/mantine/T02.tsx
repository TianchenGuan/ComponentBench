'use client';

/**
 * time_input_text-mantine-T02: Enter a time with minutes (10:15)
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single Mantine TimeInput labeled "Coffee break time" is rendered.
 * - Native input[type='time'].
 * - Configuration: step=60 (minutes).
 * - Initial state: empty.
 * - No other UI elements; clutter=none.
 * 
 * Success: The TimeInput labeled "Coffee break time" has value 10:15.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '10:15') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Breaks</Text>
      
      <div>
        <Text component="label" htmlFor="coffee-break-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Coffee break time
        </Text>
        <TimeInput
          id="coffee-break-time"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data-testid="coffee-break-time"
        />
      </div>
    </Card>
  );
}
