'use client';

/**
 * listbox_single-mantine-T06: Billing cycle: set Monthly and save
 *
 * Scene: light theme, comfortable spacing, settings_panel layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is medium.
 * A settings_panel layout includes several distractors (a read-only text summary, a help link, and a non-interactive
 * progress bar). The "Billing cycle" section contains a NavLink-based listbox with options "Weekly", "Monthly",
 * "Yearly"; initial active is "Yearly". Changes are staged until the user clicks the primary button "Save" below
 * the list; a secondary "Cancel" button reverts to the last saved value. After saving, a small inline message
 * appears: "Saved".
 *
 * Success: Selected option value equals: monthly (after clicking Save)
 * require_confirm: true, confirm_control: Save
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, Button, Group, Progress, Anchor, Paper } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [staged, setStaged] = useState<string>('yearly');
  const [committed, setCommitted] = useState<string>('yearly');
  const [showSaved, setShowSaved] = useState(false);

  const handleSelect = (value: string) => {
    setStaged(value);
    setShowSaved(false);
  };

  const handleSave = () => {
    setCommitted(staged);
    setShowSaved(true);
    if (staged === 'monthly') {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setStaged(committed);
    setShowSaved(false);
  };

  return (
    <Stack gap="md" style={{ width: 400 }}>
      {/* Distractor: text summary */}
      <Paper shadow="xs" p="md" withBorder>
        <Text size="sm" c="dimmed">Account: Premium Plan</Text>
      </Paper>

      {/* Distractor: progress bar */}
      <Paper shadow="xs" p="md" withBorder>
        <Text size="sm" mb="xs">Storage used</Text>
        <Progress value={42} size="sm" />
      </Paper>

      {/* Main Billing cycle listbox */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} size="lg" mb="md">Billing cycle</Text>
        <Stack
          gap="xs"
          data-cb-listbox-root
          data-cb-selected-value={staged}
          data-cb-committed-value={committed}
          role="listbox"
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
      </Card>

      {/* Distractor: help link */}
      <Anchor size="sm" c="dimmed">Need help? Contact support</Anchor>

      {/* Action buttons */}
      <Group>
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      </Group>

      {showSaved && (
        <Text size="sm" c="green">Saved</Text>
      )}
    </Stack>
  );
}
