'use client';

/**
 * checkbox-mantine-T02: Enable offline status indicator (top-left placement)
 *
 * Layout: an isolated Mantine card anchored near the top-left corner of the viewport.
 * The card title is "Presence". It contains a single Mantine Checkbox labeled "Show offline status".
 * Initial state: unchecked. No Save/Apply step is required; the checkbox state is committed immediately.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="lg" mb="md">
        Presence
      </Text>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        label="Show offline status"
        data-testid="cb-show-offline-status"
      />
    </Card>
  );
}
