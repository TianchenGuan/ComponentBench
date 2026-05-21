'use client';

/**
 * checkbox_tristate-mantine-T06: Compact corner: enable Show online status
 *
 * Layout: settings_panel anchored near the bottom-left of the viewport.
 * The panel uses compact spacing and renders the Mantine Checkbox in a small size.
 *
 * Target component: one Mantine tri-state checkbox labeled "Show online status".
 * Initial state: Indeterminate.
 *
 * Clutter: low. One nearby button "Manage blocked users" is present but not required.
 * 
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Button, Stack } from '@mantine/core';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('indeterminate');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 260 }}>
      <Stack gap="xs">
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={state === 'checked'}
            indeterminate={state === 'indeterminate'}
            label="Show online status"
            size="sm"
            data-testid="show-online-status-checkbox"
            readOnly
          />
        </div>
        
        <Button variant="subtle" size="xs" fullWidth>
          Manage blocked users
        </Button>
      </Stack>
    </Card>
  );
}
