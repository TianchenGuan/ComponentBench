'use client';

/**
 * checkbox-mantine-T04: Enable compact sidebar (compact + small size)
 *
 * Layout: isolated card centered in the viewport titled "Sidebar".
 * The UI uses compact spacing and the checkbox is rendered at a small size tier (Mantine small checkbox size such as xs/sm).
 * The card contains a single checkbox labeled "Compact sidebar" (initially unchecked) with a brief description.
 * There is no Save/Apply button; the checkbox state commits immediately.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 340 }}>
      <Text fw={600} size="sm" mb="xs">
        Sidebar
      </Text>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        label="Compact sidebar"
        size="xs"
        data-testid="cb-compact-sidebar"
      />
      <Text size="xs" c="dimmed" mt={4} ml={24}>
        Use a narrower sidebar to maximize content area.
      </Text>
    </Card>
  );
}
