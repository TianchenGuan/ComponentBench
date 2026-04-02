'use client';

/**
 * checkbox_tristate-mantine-T02: Clear Weekly report (Unchecked)
 *
 * Layout: centered isolated card titled "Reports".
 * The card contains a single Mantine tri-state Checkbox labeled "Weekly report".
 * Initial state: Indeterminate (dash).
 * A small helper note under the control reads "You can choose On, Off, or Partial."
 * A non-required "Reset to defaults" button appears in the card footer as a distractor.
 * 
 * Success: checkbox is Unchecked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Button, Divider, Group } from '@mantine/core';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('indeterminate');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} mb="md">Reports</Text>
      
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Checkbox
          checked={state === 'checked'}
          indeterminate={state === 'indeterminate'}
          label="Weekly report"
          data-testid="weekly-report-checkbox"
          readOnly
        />
      </div>
      <Text size="xs" c="dimmed" mt="xs">
        You can choose On, Off, or Partial.
      </Text>

      <Divider my="md" />
      
      <Group justify="flex-end">
        <Button variant="subtle" size="xs">Reset to defaults</Button>
      </Group>
    </Card>
  );
}
