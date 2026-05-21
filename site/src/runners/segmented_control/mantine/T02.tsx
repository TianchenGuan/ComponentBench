'use client';

/**
 * segmented_control-mantine-T02: Color scheme → Dark
 *
 * Layout: isolated card centered titled "Appearance".
 * The card includes one Mantine SegmentedControl labeled "Color scheme" with two options:
 * "Light" and "Dark".
 *
 * Initial state: "Light" is selected.
 * No other required controls; selection applies immediately.
 *
 * Success: The SegmentedControl labeled "Color scheme" selected value = Dark.
 */

import React, { useState } from 'react';
import { Card, Text, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = ['Light', 'Dark'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Light');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === 'Dark') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Appearance</Text>
      <Text fw={500} mb="xs">Color scheme</Text>
      <SegmentedControl
        data-testid="color-scheme"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        data={options}
        value={selected}
        onChange={handleChange}
      />
    </Card>
  );
}
