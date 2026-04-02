'use client';

/**
 * switch-mantine-T03: Match reference: Sync over cellular
 *
 * Layout: isolated_card centered in the viewport with two cards shown side-by-side.
 * Left card: "Desired state" contains a small, non-interactive switch preview (visual reference) and the caption "Desired state".
 * Right card: "Your setting" contains the interactive Mantine Switch labeled "Sync over cellular".
 * Initial state: the preview switch is OFF; the interactive "Sync over cellular" switch starts ON.
 * No additional controls are present; toggling the target switch updates immediately.
 */

import React, { useState } from 'react';
import { Card, Switch, Text, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);
  const referenceState = false; // Preview is OFF

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    if (newChecked === referenceState) {
      onSuccess();
    }
  };

  return (
    <Group gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 200 }}>
        <Text fw={500} size="sm" mb="md">Desired state</Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Switch
            checked={referenceState}
            disabled
            data-state={referenceState ? 'on' : 'off'}
            aria-checked={referenceState}
          />
        </div>
        <Text size="xs" c="dimmed" ta="center" mt="xs">
          Reference
        </Text>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 250 }}>
        <Text fw={500} size="sm" mb="md">Your setting</Text>
        <Switch
          checked={checked}
          onChange={handleChange}
          label="Sync over cellular"
          data-testid="sync-cellular-switch"
          aria-checked={checked}
        />
      </Card>
    </Group>
  );
}
