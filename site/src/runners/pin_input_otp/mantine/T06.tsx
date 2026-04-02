'use client';

/**
 * pin_input_otp-mantine-T26: Alphanumeric PinInput (length 4) with placeholders
 * 
 * A centered isolated card titled "Enter access code". The target is a Mantine
 * PinInput configured with length=4 and default type (accepts letters and numbers).
 * Each box shows a placeholder character "⊡" when empty. The input is not masked;
 * characters are visible as typed. Initial state: all four boxes empty. No confirm button.
 * 
 * Success: Target PinInput value equals 'B4F2' (case-sensitive, uppercase).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === 'B4F2') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (val: string) => {
    setValue(val.toUpperCase());
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 340 }}>
      <Text fw={600} size="lg" mb="md">Enter access code</Text>
      <Text fw={500} size="sm" mb="xs">Access code</Text>
      <Group data-testid="otp-access-code">
        <PinInput
          length={4}
          value={value}
          onChange={handleChange}
          placeholder="⊡"
        />
      </Group>
      <Text size="xs" c="dimmed" mt="xs">Enter uppercase letters and digits</Text>
    </Card>
  );
}
