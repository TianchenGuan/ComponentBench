'use client';

/**
 * time_picker-mantine-T05: Set closing time to the max (18:30) with min/max constraint
 *
 * A centered isolated card contains one Mantine TimeInput labeled "Closing time". It has min='10:00' and max='18:30'.
 * The UI displays helper text "Allowed range 10:00–18:30". The field starts empty.
 *
 * Success: The TimeInput labeled "Closing time" has canonical time value exactly 18:30 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '18:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Store Hours</Text>
      
      <div>
        <Text component="label" htmlFor="tp-closing" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Closing time (allowed range 10:00–18:30)
        </Text>
        <TimeInput
          id="tp-closing"
          value={value}
          onChange={(event) => {
            const newVal = event.currentTarget.value;
            // Enforce min/max constraints
            if (newVal && (newVal < '10:00' || newVal > '18:30')) {
              return; // Don't accept invalid times
            }
            setValue(newVal);
          }}
          min="10:00"
          max="18:30"
          data-testid="tp-closing"
        />
        <Text size="xs" c="dimmed" mt={8}>
          (Set to 18:30)
        </Text>
      </div>
    </Card>
  );
}
