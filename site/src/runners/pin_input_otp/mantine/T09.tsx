'use client';

/**
 * pin_input_otp-mantine-T29: Compact + small PinInput with restricted charset (0–3 only)
 * 
 * A centered isolated card titled "Restricted entry". The Mantine PinInput is
 * configured with length=6 and a restricted validation pattern that only accepts
 * digits 0–3. Uses compact spacing and small scale. Initial state: empty. No confirm.
 * 
 * Success: Target PinInput value equals '230103' (only digits 0-3).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, PinInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (value === '230103') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = useCallback((val: string) => {
    // Only accept digits 0-3
    const filteredValue = val.split('').filter(char => /^[0-3]$/.test(char)).join('');
    
    if (filteredValue !== val) {
      // Show error briefly
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
    
    setValue(filteredValue);
  }, []);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 360 }}>
      <Text fw={600} size="md" mb="sm">Restricted entry</Text>
      <Text fw={500} size="xs" mb={4}>Restricted code</Text>
      <Text size="xs" c="dimmed" mb="xs">Only digits 0–3 are allowed</Text>
      <Group data-testid="otp-restricted-code">
        <PinInput
          length={6}
          type="number"
          value={value}
          onChange={handleChange}
          size="xs"
          error={error}
        />
      </Group>
      {error && <Text size="xs" c="red" mt="xs">Only 0–3 allowed</Text>}
    </Card>
  );
}
