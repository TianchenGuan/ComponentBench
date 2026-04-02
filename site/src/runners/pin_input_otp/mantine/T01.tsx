'use client';

/**
 * pin_input_otp-mantine-T21: Enter 4-digit PIN (Mantine PinInput)
 * 
 * A centered isolated card titled "Unlock". The card contains a Mantine PinInput
 * configured with length=4 and type='number'. It renders four equal-sized input
 * boxes in a row with Mantine styling and auto-advance between boxes.
 * Initial state: all four boxes empty. No confirm button.
 * 
 * Success: Target OTP value equals '9271' with length 4.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '9271') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="lg" mb="md">Unlock</Text>
      <Text fw={500} size="sm" mb="xs">PIN</Text>
      <Group data-testid="otp-pin">
        <PinInput
          length={4}
          type="number"
          value={value}
          onChange={setValue}
        />
      </Group>
    </Card>
  );
}
