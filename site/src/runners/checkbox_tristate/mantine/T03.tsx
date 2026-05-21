'use client';

/**
 * checkbox_tristate-mantine-T03: Match Show to teammates to desired preview (Unchecked)
 *
 * Layout: centered isolated card titled "Content visibility".
 * Target control: one Mantine tri-state Checkbox labeled "Show to teammates".
 * To the right of the checkbox is a static "Desired state" preview:
 * a small, non-clickable checkbox icon with a caption.
 * For this task, the preview shows the empty box (Unchecked).
 * Initial state of "Show to teammates": Checked.
 * 
 * Success: checkbox is Unchecked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Group, Box } from '@mantine/core';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('checked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} mb="md">Content visibility</Text>
      
      <Group justify="space-between" align="center">
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={state === 'checked'}
            indeterminate={state === 'indeterminate'}
            label="Show to teammates"
            data-testid="show-to-teammates-checkbox"
            readOnly
          />
        </div>
        
        <Box aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox checked={false} disabled readOnly style={{ pointerEvents: 'none' }} />
          <Text size="xs" c="dimmed">Desired state</Text>
        </Box>
      </Group>
    </Card>
  );
}
