'use client';

/**
 * select_custom_single-mantine-T06: Match Plan to the star badge
 *
 * Layout: centered isolated card titled "Subscription".
 * The card contains one Mantine Select labeled "Plan".
 *
 * Options are custom-rendered using Combobox-based layout: each option shows a badge icon on the left and plan name text:
 * - Starter (circle badge)
 * - Pro (star badge)
 * - Enterprise (diamond badge)
 *
 * Visual guidance: a small "Reference" card on the right shows only the star badge icon (no plan name text).
 * The task is to select the plan whose badge matches that icon.
 *
 * Initial state: Plan is currently "Starter".
 * Feedback: selecting an option updates the field immediately; no Apply/OK button.
 *
 * Success: The Mantine Select labeled "Plan" has selected value exactly "Pro" (the star-badge option).
 */

import React, { useState } from 'react';
import { Card, Text, Select, Group, Box, Stack } from '@mantine/core';
import { IconCircle, IconStar, IconDiamond } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const plans = [
  { value: 'Starter', label: 'Starter', icon: IconCircle },
  { value: 'Pro', label: 'Pro', icon: IconStar },
  { value: 'Enterprise', label: 'Enterprise', icon: IconDiamond },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Starter');

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Pro') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Subscription</Text>
      <Group align="flex-start" gap="xl">
        <Stack style={{ flex: 1 }}>
          <Select
            data-testid="plan-select"
            label="Plan"
            data={plans.map(p => ({
              value: p.value,
              label: p.label,
            }))}
            value={value}
            onChange={handleChange}
            renderOption={({ option }) => {
              const plan = plans.find(p => p.value === option.value);
              const IconComponent = plan?.icon || IconCircle;
              return (
                <Group gap="sm">
                  <IconComponent size={18} />
                  <span>{option.label}</span>
                </Group>
              );
            }}
          />
        </Stack>
        <Box
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
            minWidth: 80,
          }}
        >
          <Text size="xs" c="dimmed" mb="xs">Reference</Text>
          <IconStar size={36} color="#1890ff" />
        </Box>
      </Group>
    </Card>
  );
}
