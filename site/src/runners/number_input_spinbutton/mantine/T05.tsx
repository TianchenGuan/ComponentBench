'use client';

/**
 * number_input_spinbutton-mantine-T05: Enter budget with $ prefix and commas
 * 
 * A centered isolated card titled "Campaign budget" contains one Mantine NumberInput labeled "Budget".
 * The component is configured with:
 * - prefix="$" and thousandSeparator="," so large numbers display with commas.
 * - decimalScale=2 and fixedDecimalScale enabled so two decimals are always shown.
 * - min=0, max=100000, step=50.
 * Initial state: value is shown as $0.00.
 * A read-only summary line below shows "Remaining: $0.00" and updates immediately; no Apply button exists.
 * 
 * Success: The committed numeric value of "Budget" is within ±0.005 of 1500.00.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | number>(0);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (!isNaN(numValue) && Math.abs(numValue - 1500.0) < 0.005) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const formatDisplay = (val: string | number): string => {
    const numVal = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(numVal)) return '$0.00';
    return `$${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Campaign budget</Text>
      <NumberInput
        label="Budget"
        prefix="$"
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
        min={0}
        max={100000}
        step={50}
        value={value}
        onChange={(val) => setValue(val)}
        data-testid="budget-input"
      />
      <Text size="sm" c="dimmed" mt="xs">
        USD (shows thousands separators)
      </Text>
      <Text size="sm" mt="md">
        Remaining: {formatDisplay(value)}
      </Text>
    </Card>
  );
}
