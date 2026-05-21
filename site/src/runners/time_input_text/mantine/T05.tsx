'use client';

/**
 * time_input_text-mantine-T05: Enter time with seconds using native TimeInput
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single Mantine TimeInput labeled "Precise time" is displayed.
 * - Native input[type='time'] with step=1 to enable seconds.
 * - Initial state: empty.
 * - Users can type the full value '09:15:30' into the field; depending on browser UI, seconds controls may appear.
 * - No other inputs; clutter=none.
 * 
 * Success: The TimeInput labeled "Precise time" has value 09:15:30 (including seconds).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '09:15:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Precision Timing</Text>
      
      <div>
        <Text component="label" htmlFor="precise-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Precise time
        </Text>
        <TimeInput
          id="precise-time"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          withSeconds
          data-testid="precise-time"
        />
      </div>
    </Card>
  );
}
