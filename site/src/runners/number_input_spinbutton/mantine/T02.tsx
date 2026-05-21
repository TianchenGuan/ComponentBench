'use client';

/**
 * number_input_spinbutton-mantine-T02: Set guests to 4
 * 
 * The page shows a centered isolated card titled "Reservation".
 * It contains one Mantine NumberInput labeled "Guests".
 * - Constraints: min=1, max=12, step=1.
 * - Initial state: value is 2.
 * The increment/decrement controls are visible; helper text says "Adults and children combined".
 * No confirm button is present.
 * 
 * Success: The numeric value of the target number input is 4.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | number>(2);

  useEffect(() => {
    if (value === 4) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Reservation</Text>
      <NumberInput
        label="Guests"
        description="Adults and children combined"
        min={1}
        max={12}
        step={1}
        value={value}
        onChange={(val) => setValue(val)}
        data-testid="guests-input"
      />
    </Card>
  );
}
