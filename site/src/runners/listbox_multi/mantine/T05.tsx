'use client';

/**
 * listbox_multi-mantine-T05: Compact small: select permission flags
 *
 * Layout: isolated_card anchored near the top-right of the viewport.
 * Target component: Mantine Checkbox.Group labeled "Permissions" rendered with small checkbox size (xs) and compact spacing.
 * Options (18) include several similar labels.
 * Initial state: "Read invoices" is preselected and "Edit invoices" is also preselected.
 * No overlays and no scrolling.
 *
 * Success: The target listbox has exactly: Read invoices, Download invoices, View audit log, Manage API keys.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = [
  'Read invoices',
  'Download invoices',
  'Edit invoices',
  'Manage API keys',
  'Manage API keys (legacy)',
  'View audit log',
  'View audit logs (extended)',
  'Export data',
  'Create users',
  'Delete users',
  'Manage billing',
  'View reports',
  'Create reports',
  'Manage integrations',
  'View analytics',
  'Manage webhooks',
  'Admin access',
  'Super admin',
];

const targetSet = ['Read invoices', 'Download invoices', 'View audit log', 'Manage API keys'];
const initialSelected = ['Read invoices', 'Edit invoices'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="md" mb="xs">
        Permissions
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Permissions (compact).
      </Text>
      <Checkbox.Group
        data-testid="listbox-permissions"
        value={selected}
        onChange={setSelected}
      >
        <Stack gap={4}>
          {options.map((opt) => (
            <Checkbox key={opt} value={opt} label={opt} size="xs" />
          ))}
        </Stack>
      </Checkbox.Group>
      <Text size="xs" c="dimmed" mt="sm">
        Selected: {selected.join(', ')}
      </Text>
    </Card>
  );
}
