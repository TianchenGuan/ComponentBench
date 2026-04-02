'use client';

/**
 * pin_input_otp-mantine-T23: Clear a filled PinInput to empty
 * 
 * A centered isolated card titled "Recovery". Under the label "Recovery code" is
 * a Mantine PinInput with length=6 and type='number'. Initial state: all six boxes
 * are prefilled with digits (4 4 0 9 1 2). No separate clear button; user must
 * delete using keyboard actions. No confirm button.
 * 
 * Success: All 6 inputs are empty (value is '').
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, PinInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('440912');

  useEffect(() => {
    if (value === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Recovery</Text>
      <Text fw={500} size="sm" mb="xs">Recovery code</Text>
      <Group data-testid="otp-recovery-code">
        <PinInput
          length={6}
          type="number"
          value={value}
          onChange={setValue}
        />
      </Group>
    </Card>
  );
}
