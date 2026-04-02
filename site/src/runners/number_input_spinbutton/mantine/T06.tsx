'use client';

/**
 * number_input_spinbutton-mantine-T06: Dark theme: set opacity percent
 * 
 * The UI uses a dark theme.
 * A centered isolated card titled "Overlay style" contains one Mantine NumberInput labeled "Opacity (%)".
 * It is configured with suffix="%" and allowDecimal={false} so only integers are accepted.
 * - Constraints: min=0, max=100, step=5.
 * - Initial state: value is 60.
 * A small preview swatch updates opacity immediately; there is no confirm button.
 * 
 * Success: The numeric value of the target number input is 75.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | number>(60);

  useEffect(() => {
    if (value === 75) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const numValue = typeof value === 'number' ? value : parseInt(String(value), 10);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Overlay style</Text>
      <NumberInput
        label="Opacity (%)"
        suffix="%"
        allowDecimal={false}
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(val) => setValue(val)}
        data-testid="opacity-input"
      />
      <Text size="sm" c="dimmed" mt="md" mb="xs">Preview:</Text>
      <Box 
        style={{ 
          width: 100, 
          height: 50, 
          background: `rgba(59, 130, 246, ${(numValue || 0) / 100})`,
          borderRadius: 4,
          border: '1px solid var(--mantine-color-gray-6)'
        }} 
      />
    </Card>
  );
}
