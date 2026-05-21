'use client';

/**
 * select_custom_single-mantine-T04: Set Shipping speed to Standard
 *
 * Layout: form_section titled "Shipping preferences".
 * Spacing is comfortable with default-sized controls.
 *
 * Instances: two Mantine Select components are present:
 * 1) "Shipping speed" (currently "Express")  ← TARGET
 * 2) "Packaging" (currently "Eco")
 *
 * Shipping speed options: Standard, Express, Overnight.
 * Packaging options: Eco, Gift, Minimal.
 *
 * Clutter: the form also includes a numeric input "Insurance amount" and a button "Preview label".
 * These are distractors and do not affect success.
 *
 * Feedback: selecting an option updates the field immediately; no Apply/Save button required.
 *
 * Success: The Mantine Select labeled "Shipping speed" has selected value exactly "Standard".
 */

import React, { useState } from 'react';
import { Card, Text, Select, NumberInput, Button, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const speedOptions = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Express', label: 'Express' },
  { value: 'Overnight', label: 'Overnight' },
];

const packagingOptions = [
  { value: 'Eco', label: 'Eco' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Minimal', label: 'Minimal' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [shippingSpeed, setShippingSpeed] = useState<string | null>('Express');
  const [packaging, setPackaging] = useState<string | null>('Eco');

  const handleSpeedChange = (newValue: string | null) => {
    setShippingSpeed(newValue);
    if (newValue === 'Standard') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Shipping preferences</Text>
      <Stack gap="md">
        <Select
          data-testid="shipping-speed-select"
          label="Shipping speed"
          data={speedOptions}
          value={shippingSpeed}
          onChange={handleSpeedChange}
        />
        <Select
          data-testid="packaging-select"
          label="Packaging"
          data={packagingOptions}
          value={packaging}
          onChange={setPackaging}
        />
        <NumberInput
          label="Insurance amount"
          placeholder="0.00"
          prefix="$"
        />
        <Group>
          <Button variant="outline">Preview label</Button>
        </Group>
      </Stack>
    </Card>
  );
}
