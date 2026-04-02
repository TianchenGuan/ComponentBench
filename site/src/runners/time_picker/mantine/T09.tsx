'use client';

/**
 * time_picker-mantine-T09: Clear a prefilled time by deleting all inputs
 *
 * A centered isolated card contains one Mantine TimeInput labeled "Reminder time". 
 * The picker is pre-filled with 12:30. Clearing must remove the value to commit an empty state.
 *
 * Success: The "Reminder time" Mantine TimeInput has no selected value (canonical empty string).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('12:30');

  useEffect(() => {
    if (value === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Reminders</Text>
      
      <div>
        <Text component="label" htmlFor="tp-reminder" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Reminder time
        </Text>
        <TimeInput
          id="tp-reminder"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data-testid="tp-reminder"
        />
        <Text size="xs" c="dimmed" mt={8}>
          (Clear to blank)
        </Text>
      </div>
    </Card>
  );
}
