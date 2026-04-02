'use client';

/**
 * switch-mantine-T01: Enable newsletter subscription
 *
 * Layout: isolated_card centered in the viewport titled "Newsletter".
 * The card contains one Mantine Switch with a visible label: "Subscribe to newsletter".
 * Initial state: the switch is OFF.
 * The switch uses default size (md) and standard spacing.
 * Feedback: toggling updates immediately with no confirmation and no toast.
 */

import React, { useState } from 'react';
import { Card, Switch, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
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
      <Text fw={500} size="lg" mb="md">Newsletter</Text>
      <Switch
        checked={checked}
        onChange={handleChange}
        label="Subscribe to newsletter"
        data-testid="newsletter-switch"
        aria-checked={checked}
      />
    </Card>
  );
}
