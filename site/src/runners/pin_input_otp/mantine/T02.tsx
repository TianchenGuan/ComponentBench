'use client';

/**
 * pin_input_otp-mantine-T22: Enter 6-digit OTP with one-time-code autocomplete
 * 
 * A centered isolated card titled "Verify device". The target component is a Mantine
 * PinInput configured with length=6, type='number', and oneTimeCode enabled.
 * It renders six input boxes in a row with auto-advance. A small caption explains
 * "You can paste the full code". Initial state: empty. No confirm/apply button.
 * 
 * Success: Target OTP value equals '584019' with length 6.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '584019') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Verify device</Text>
      <Text fw={500} size="sm" mb="xs">One-time code</Text>
      <Group data-testid="otp-one-time-code">
        <PinInput
          length={6}
          type="number"
          value={value}
          onChange={setValue}
          oneTimeCode
        />
      </Group>
      <Text size="xs" c="dimmed" mt="xs">You can paste the full code</Text>
    </Card>
  );
}
