'use client';

/**
 * time_picker-mantine-T02: Set check-out time to 14:00 (inputs only)
 *
 * A centered isolated card contains one Mantine TimeInput labeled "Check-out time". 
 * The field starts with 13:00. The component uses native time input behavior.
 *
 * Success: The TimeInput labeled "Check-out time" has canonical time value exactly 14:00 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('13:00');

  useEffect(() => {
    if (value === '14:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Hotel Check-out</Text>
      
      <div>
        <Text component="label" htmlFor="tp-checkout" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Check-out time
        </Text>
        <TimeInput
          id="tp-checkout"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data-testid="tp-checkout"
        />
        <Text size="xs" c="dimmed" mt={8}>
          (Change to 14:00)
        </Text>
      </div>
    </Card>
  );
}
