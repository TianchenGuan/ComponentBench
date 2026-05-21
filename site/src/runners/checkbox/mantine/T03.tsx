'use client';

/**
 * checkbox-mantine-T03: Enable secondary backup (two checkbox instances)
 *
 * Layout: isolated card centered in the viewport titled "Backups".
 * The card contains two Mantine Checkbox controls:
 *   - "Primary backup" (initially checked)
 *   - "Secondary backup" (initially unchecked)  ← target
 * There is no Save/Apply button; toggles commit immediately.
 * The task specifically targets the checkbox labeled "Secondary backup".
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [primaryChecked, setPrimaryChecked] = useState(true);
  const [secondaryChecked, setSecondaryChecked] = useState(false);

  const handleSecondaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setSecondaryChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">
        Backups
      </Text>
      <Stack gap="sm">
        <Checkbox
          checked={primaryChecked}
          onChange={(e) => setPrimaryChecked(e.currentTarget.checked)}
          label="Primary backup"
          data-testid="cb-primary-backup"
        />
        <Checkbox
          checked={secondaryChecked}
          onChange={handleSecondaryChange}
          label="Secondary backup"
          data-testid="cb-secondary-backup"
        />
      </Stack>
    </Card>
  );
}
