'use client';

/**
 * select_native-mantine-T02: Choose Visa as payment method (off-center)
 *
 * Layout: an isolated card anchored near the bottom-left of the viewport.
 * The card is titled "Payment" and contains one Mantine NativeSelect labeled "Payment method".
 *
 * Options (label → value):
 * - Visa → visa  ← TARGET
 * - Mastercard → mc
 * - American Express → amex
 * - PayPal → paypal
 *
 * Initial state: "PayPal" is selected.
 * Distractors: a short static note "You can change this later".
 * Feedback: immediate, no Apply/Save.
 *
 * Success: The target native select has selected option value 'visa' (label 'Visa').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mc' },
  { label: 'American Express', value: 'amex' },
  { label: 'PayPal', value: 'paypal' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('paypal');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'visa') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="lg" mb="md">Payment</Text>
      
      <NativeSelect
        data-testid="payment-method-select"
        data-canonical-type="select_native"
        data-selected-value={selected}
        label="Payment method"
        value={selected}
        onChange={handleChange}
        data={options}
        mb="sm"
      />

      <Text size="sm" c="dimmed">
        You can change this later
      </Text>
    </Card>
  );
}
