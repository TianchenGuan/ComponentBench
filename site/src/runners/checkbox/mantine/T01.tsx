'use client';

/**
 * checkbox-mantine-T01: Enable reminders (dark theme)
 *
 * Layout: isolated card centered in the viewport, rendered in dark theme.
 * The card title is "Reminders". It contains one Mantine Checkbox labeled "Enable reminders".
 * Initial state: unchecked. There is no Save/Apply button; toggling the checkbox immediately commits the state.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox } from '@mantine/core';
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
      <Text fw={600} size="lg" mb="md">
        Reminders
      </Text>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        label="Enable reminders"
        data-testid="cb-enable-reminders"
      />
    </Card>
  );
}
