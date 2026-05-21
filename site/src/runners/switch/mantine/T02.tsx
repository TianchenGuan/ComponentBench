'use client';

/**
 * switch-mantine-T02: Turn off sound (inner labels)
 *
 * Layout: isolated_card centered in the viewport titled "Audio".
 * A single Mantine Switch is labeled "Sound" and displays inner labels: "ON" when enabled and "OFF" when disabled.
 * Initial state: the switch is ON.
 * No other form fields or toggles are present; only a short description line is shown below the switch.
 * Feedback: toggling updates immediately and the inner label changes accordingly.
 */

import React, { useState } from 'react';
import { Card, Switch, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    if (!newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Audio</Text>
      <Switch
        checked={checked}
        onChange={handleChange}
        label="Sound"
        onLabel="ON"
        offLabel="OFF"
        data-testid="sound-switch"
        aria-checked={checked}
      />
      <Text size="sm" c="dimmed" mt="xs">
        Enable or disable all sound effects in the application.
      </Text>
    </Card>
  );
}
