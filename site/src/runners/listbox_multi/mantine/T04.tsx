'use client';

/**
 * listbox_multi-mantine-T04: Drawer: add team roles
 *
 * Layout: drawer_flow. The main page shows a "Team" card with a button labeled "Add roles".
 * Clicking the button opens a left-side Mantine Drawer titled "Add roles".
 * Inside the drawer is the target component: a Checkbox.Group listbox labeled "Team roles".
 * Options (12): Admin, Editor, Viewer, Reviewer, Commenter, Reporter, Billing, Security, Support, Analyst, Guest, Owner.
 * Initial state: none selected.
 * No explicit Apply button; selections update immediately and a small line "Selected roles: …" updates live.
 *
 * Success: The target listbox has exactly: Reviewer, Commenter, Reporter.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Button, Drawer, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = [
  'Admin', 'Editor', 'Viewer', 'Reviewer', 'Commenter', 'Reporter',
  'Billing', 'Security', 'Support', 'Analyst', 'Guest', 'Owner',
];
const targetSet = ['Reviewer', 'Commenter', 'Reporter'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="xs">
          Team
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Team roles (open drawer to add roles).
        </Text>
        <Button onClick={() => setIsOpen(true)}>Add roles</Button>
      </Card>

      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add roles"
        position="left"
        size="sm"
      >
        <Text size="sm" mb="md" fw={500}>
          Team roles
        </Text>
        <Checkbox.Group
          data-testid="listbox-team-roles"
          value={selected}
          onChange={setSelected}
        >
          <Stack gap="xs">
            {options.map((opt) => (
              <Checkbox key={opt} value={opt} label={opt} />
            ))}
          </Stack>
        </Checkbox.Group>
        <Text size="sm" c="dimmed" mt="md">
          Selected roles: {selected.join(', ') || '–'}
        </Text>
      </Drawer>
    </>
  );
}
