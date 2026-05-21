'use client';

/**
 * select_native-mantine-T04: Match billing cycle to preview chip (mixed guidance)
 *
 * Layout: a centered isolated card titled "Plan details".
 * At the top is a Preview chip that shows the target billing cycle both visually (icon + pill) and as text (e.g., "Monthly").
 *
 * Below is the target Mantine NativeSelect labeled "Billing cycle".
 * Options (label → value):
 * - Monthly → monthly  ← TARGET
 * - Quarterly → quarterly
 * - Yearly → yearly
 *
 * Initial state: "Yearly" is selected.
 * Feedback: immediate; no Apply/Save.
 * Distractors: a pricing paragraph below the select (static text).
 *
 * Success: The target native select has selected option value 'monthly' (label 'Monthly').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Badge, Group, Box } from '@mantine/core';
import { IconCalendarMonth } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('yearly');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'monthly') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Plan details</Text>
      
      <Box mb="lg">
        <Text size="sm" c="dimmed" mb="xs">Preview</Text>
        <Group gap="xs">
          <IconCalendarMonth size={18} />
          <Badge color="blue" variant="filled">Monthly</Badge>
        </Group>
      </Box>
      
      <NativeSelect
        data-testid="billing-cycle-select"
        data-canonical-type="select_native"
        data-selected-value={selected}
        label="Billing cycle"
        value={selected}
        onChange={handleChange}
        data={options}
        mb="md"
      />

      <Text size="sm" c="dimmed">
        Monthly: $9.99/month{'\n'}
        Quarterly: $24.99/quarter (save 17%){'\n'}
        Yearly: $89.99/year (save 25%)
      </Text>
    </Card>
  );
}
