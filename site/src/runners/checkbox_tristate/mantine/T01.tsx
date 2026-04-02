'use client';

/**
 * checkbox_tristate-mantine-T01: Set Auto-renew to Partial
 *
 * Layout: centered isolated card using Mantine default styles.
 * The card contains a single Mantine tri-state Checkbox labeled "Auto-renew subscription".
 * The checkbox supports an indeterminate (mixed) state and cycles through
 * Unchecked → Partial (indeterminate) → Checked when clicked.
 * Initial state: Checked.
 * A small read-only text line under the checkbox shows "Current state: Checked / Partial / Unchecked".
 * 
 * Success: checkbox is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text } from '@mantine/core';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue, tristateToDisplayString } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('checked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Checkbox
          checked={state === 'checked'}
          indeterminate={state === 'indeterminate'}
          label="Auto-renew subscription"
          data-testid="auto-renew-checkbox"
          readOnly
        />
      </div>
      <Text size="xs" c="dimmed" mt="sm">
        Current state: {tristateToDisplayString(state)}
      </Text>
    </Card>
  );
}
