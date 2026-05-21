'use client';

/**
 * time_input_text-mantine-T01: Set check-in time (Mantine TimeInput)
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single Mantine TimeInput labeled "Check-in time" is shown.
 * - Implementation: native input[type='time'] via Mantine TimeInput.
 * - Configuration: minute precision (step=60), no custom dropdown.
 * - Initial state: empty.
 * - No distractors; clutter=none.
 * 
 * Success: The TimeInput labeled "Check-in time" has value 14:00 (24-hour, minutes).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '14:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Schedule</Text>
      
      <div>
        <Text component="label" htmlFor="checkin-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Check-in time
        </Text>
        <TimeInput
          id="checkin-time"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data-testid="checkin-time"
        />
      </div>
    </Card>
  );
}
