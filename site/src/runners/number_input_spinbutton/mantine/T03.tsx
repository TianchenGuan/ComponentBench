'use client';

/**
 * number_input_spinbutton-mantine-T03: Clear unit number
 * 
 * A centered isolated card titled "Shipping address" contains one Mantine NumberInput labeled "Unit number (optional)".
 * - Constraints: min=1, max=9999, step=1.
 * - Initial state: value is 45.
 * The label includes "(optional)" and placeholder reads "Leave blank if not applicable".
 * There is no separate clear button; the intended action is to delete the current value until the field is empty.
 * 
 * Success: The target number input is empty (no value).
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | number>(45);

  useEffect(() => {
    if (value === '' || value === undefined) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Shipping address</Text>
      <NumberInput
        label="Unit number (optional)"
        placeholder="Leave blank if not applicable"
        min={1}
        max={9999}
        step={1}
        value={value}
        onChange={(val) => setValue(val)}
        data-testid="unit-number-input"
      />
    </Card>
  );
}
