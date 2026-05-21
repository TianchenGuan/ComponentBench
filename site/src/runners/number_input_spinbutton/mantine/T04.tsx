'use client';

/**
 * number_input_spinbutton-mantine-T04: Fix minimum order to 10 (starts invalid)
 * 
 * A centered isolated card titled "Order rules" contains one Mantine NumberInput labeled "Minimum order".
 * - Constraints: min=1, max=100, step=1, allowNegative={false}.
 * - Initial state: value is 0 and the component shows an error message below the input: "Minimum order must be at least 1".
 * The default increment/decrement controls are visible. There are no other interactive elements and no confirmation button; the error clears as soon as the value is valid.
 * 
 * Success: The numeric value of the target number input is 10, and the input is in a valid (non-error) state.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | number>(0);
  
  const numValue = typeof value === 'number' ? value : parseInt(value, 10);
  const isValid = !isNaN(numValue) && numValue >= 1 && numValue <= 100;

  useEffect(() => {
    if (numValue === 10 && isValid) {
      onSuccess();
    }
  }, [numValue, isValid, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Order rules</Text>
      <NumberInput
        label="Minimum order"
        min={1}
        max={100}
        step={1}
        allowNegative={false}
        value={value}
        onChange={(val) => setValue(val)}
        error={!isValid ? "Minimum order must be at least 1" : undefined}
        data-testid="minimum-order-input"
      />
    </Card>
  );
}
