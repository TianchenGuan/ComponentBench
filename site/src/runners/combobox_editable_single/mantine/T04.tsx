'use client';

/**
 * combobox_editable_single-mantine-T04: Enter a custom dessert name (free text)
 *
 * A small isolated card titled "Order note" is anchored near the bottom-left of the viewport.
 * It contains one Mantine Autocomplete input labeled "Dessert".
 * - Scene: isolated_card layout, bottom_left placement, light theme, comfortable spacing, default scale.
 * - Component behavior: The Autocomplete shows suggestions while typing but accepts any text value.
 * - Suggestions: Brownie, Cheesecake, Ice cream, Pudding, Tarte tatin (no Tiramisu in suggestions).
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Dessert" combobox value equals "Tiramisu".
 */

import React, { useState } from 'react';
import { Card, Text, Autocomplete } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const desserts = ['Brownie', 'Cheesecake', 'Ice cream', 'Pudding', 'Tarte tatin'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Tiramisu') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Order note</Text>
      <Text fw={500} size="sm" mb={8}>Dessert</Text>
      <Autocomplete
        data-testid="dessert-autocomplete"
        placeholder="Enter dessert"
        data={desserts}
        value={value}
        onChange={handleChange}
      />
      <Text size="xs" c="dimmed" mt={8}>Goal: Tiramisu</Text>
    </Card>
  );
}
