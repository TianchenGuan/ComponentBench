'use client';

/**
 * pin_input_otp-mantine-T28: Masked PinInput in dark theme
 * 
 * A centered isolated card in dark theme titled "Admin verification". The target
 * is a Mantine PinInput configured with length=6, type='number', and mask enabled,
 * so typed characters display as dots. Initial state: empty. No confirm button;
 * success is based on the underlying PinInput value.
 * 
 * Success: Target OTP value equals '642981'.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '642981') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Admin verification</Text>
      <Text fw={500} size="sm" mb="xs">Admin code</Text>
      <Group data-testid="otp-admin-code">
        <PinInput
          length={6}
          type="number"
          value={value}
          onChange={setValue}
          mask
        />
      </Group>
    </Card>
  );
}
