'use client';

/**
 * segmented_control-mantine-T01: Preferred framework → Vue
 *
 * Layout: isolated card centered titled "Developer profile".
 * The card contains a Mantine SegmentedControl labeled "Preferred framework" with options:
 * "React", "Angular", "Svelte", "Vue".
 *
 * Initial state: "React" is selected.
 * Default size, comfortable spacing. No Apply button; selection updates immediately.
 *
 * Success: The SegmentedControl labeled "Preferred framework" has selected value = Vue.
 */

import React, { useState } from 'react';
import { Card, Text, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = ['React', 'Angular', 'Svelte', 'Vue'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('React');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === 'Vue') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Developer profile</Text>
      <Text fw={500} mb="xs">Preferred framework</Text>
      <SegmentedControl
        data-testid="preferred-framework"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        data={options}
        value={selected}
        onChange={handleChange}
        fullWidth
      />
    </Card>
  );
}
