'use client';

/**
 * listbox_single-mantine-T09: Visibility: set Private and save (dark, bottom-left)
 *
 * Scene: dark theme, comfortable spacing, isolated_card layout, placed at bottom_left of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A single isolated card is anchored near the bottom-left of the viewport and rendered in dark theme.
 * The card title is "Visibility". Inside is a NavLink-based single-select listbox with three options:
 * "Public", "Team-only", "Private". Initial active option is "Team-only". Below the list is a primary button
 * labeled "Save changes". Selection changes are staged; the new visibility is only committed after clicking
 * "Save changes". After saving, a small "Saved" toast appears briefly.
 *
 * Success: Selected option value equals: private (after clicking Save changes)
 * require_confirm: true, confirm_control: Save changes
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, Button, Notification } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'public', label: 'Public' },
  { value: 'team_only', label: 'Team-only' },
  { value: 'private', label: 'Private' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [staged, setStaged] = useState<string>('team_only');
  const [committed, setCommitted] = useState<string>('team_only');
  const [showSaved, setShowSaved] = useState(false);

  const handleSelect = (value: string) => {
    setStaged(value);
    setShowSaved(false);
  };

  const handleSave = () => {
    setCommitted(staged);
    setShowSaved(true);
    if (staged === 'private') {
      onSuccess();
    }
    // Auto-hide toast after 2 seconds
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
        <Text fw={600} size="lg" mb="md">Visibility</Text>

        <Stack
          gap="xs"
          data-cb-listbox-root
          data-cb-selected-value={staged}
          data-cb-committed-value={committed}
          role="listbox"
          mb="md"
        >
          {options.map(opt => (
            <NavLink
              key={opt.value}
              label={opt.label}
              active={staged === opt.value}
              onClick={() => handleSelect(opt.value)}
              data-cb-option-value={opt.value}
              role="option"
              aria-selected={staged === opt.value}
            />
          ))}
        </Stack>

        <Button onClick={handleSave}>Save changes</Button>
      </Card>

      {showSaved && (
        <Notification
          color="green"
          title="Saved"
          onClose={() => setShowSaved(false)}
          style={{ position: 'absolute', top: -60, left: 0, width: '100%' }}
        >
          Changes saved successfully
        </Notification>
      )}
    </div>
  );
}
