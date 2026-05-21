'use client';

/**
 * number_input_spinbutton-mantine-T01: Set tickets to 2
 * 
 * A centered isolated card titled "Event registration" contains one Mantine NumberInput labeled "Tickets".
 * The NumberInput shows its default increment/decrement controls.
 * - Constraints: min=1, max=10, step=1.
 * - Initial state: value is 1.
 * A read-only note below says "You can adjust later" and does not affect success.
 * 
 * Success: The numeric value of the target number input is 2.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | number>(1);

  useEffect(() => {
    if (value === 2) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Event registration</Text>
      <NumberInput
        label="Tickets"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(val) => setValue(val)}
        data-testid="tickets-input"
      />
      <Text size="sm" c="dimmed" mt="sm">
        You can adjust later
      </Text>
    </Card>
  );
}
