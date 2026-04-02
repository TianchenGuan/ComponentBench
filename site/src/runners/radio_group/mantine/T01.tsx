'use client';

/**
 * radio_group-mantine-T01: Subscription: choose Pro plan
 *
 * A centered isolated card titled "Subscription" contains one Mantine Radio.Group with label "Subscription plan".
 * Three Radio options are stacked vertically with generous spacing:
 * - Free
 * - Pro
 * - Team
 * Initial state: Free is selected.
 * A short description under the label explains that you can change plans anytime. No Save button; selection updates the plan badge immediately.
 *
 * Success: The "Subscription plan" Radio.Group selected value equals "pro" (label "Pro").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Stack, Badge, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Team', value: 'team' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('free');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === 'pro') {
      onSuccess();
    }
  };

  const selectedLabel = options.find(o => o.value === selected)?.label || '';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Subscription</Text>
        <Badge color={selected === 'pro' ? 'blue' : 'gray'}>{selectedLabel}</Badge>
      </Group>
      
      <Radio.Group
        data-canonical-type="radio_group"
        data-selected-value={selected}
        value={selected}
        onChange={handleChange}
        label="Subscription plan"
        description="You can change plans anytime"
      >
        <Stack gap="xs" mt="xs">
          {options.map(option => (
            <Radio key={option.value} value={option.value} label={option.label} />
          ))}
        </Stack>
      </Radio.Group>
    </Card>
  );
}
