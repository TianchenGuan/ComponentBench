'use client';

/**
 * switch-mantine-T05: Dark theme: enable Focus mode
 *
 * Theme: dark (Mantine dark color scheme).
 * Layout: isolated_card centered in the viewport titled "Focus".
 * The card contains one Mantine Switch labeled "Focus mode" with helper text ("Silence non-urgent notifications").
 * Initial state: the switch is OFF.
 * Feedback: toggling updates immediately; there are no overlays or confirmation steps.
 */

import React, { useState } from 'react';
import { Card, Switch, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Focus</Text>
      <Switch
        checked={checked}
        onChange={handleChange}
        label="Focus mode"
        data-testid="focus-mode-switch"
        aria-checked={checked}
      />
      <Text size="sm" c="dimmed" ml={52} mt="xs">
        Silence non-urgent notifications
      </Text>
    </Card>
  );
}
