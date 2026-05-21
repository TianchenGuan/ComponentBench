'use client';

/**
 * number_input_spinbutton-mantine-T10: High precision: set exchange rate to 1.237
 * 
 * A centered isolated card titled "FX settings" contains one Mantine NumberInput labeled "Exchange rate".
 * It is configured for high precision:
 * - decimalScale=3 (exactly three digits after the decimal are allowed)
 * - step=0.001
 * - min=0.500, max=2.000
 * Default (comfortable) spacing and default size are used.
 * Initial state: value is 1.200.
 * A helper line shows "Last fetched: 1.200" and updates immediately as the field changes. No Apply button is present.
 * 
 * Success: The numeric value of the target number input is within ±0.0005 of 1.237.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | number>(1.2);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (!isNaN(numValue) && Math.abs(numValue - 1.237) < 0.0005) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const formatValue = (val: string | number): string => {
    const numVal = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(numVal)) return '1.200';
    return numVal.toFixed(3);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">FX settings</Text>
      <NumberInput
        label="Exchange rate"
        decimalScale={3}
        fixedDecimalScale
        step={0.001}
        min={0.5}
        max={2.0}
        value={value}
        onChange={(val) => setValue(val)}
        data-testid="exchange-rate-input"
      />
      <Text size="sm" c="dimmed" mt="md">
        Last fetched: {formatValue(value)}
      </Text>
    </Card>
  );
}
