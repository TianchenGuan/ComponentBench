'use client';

/**
 * listbox_multi-mantine-v2-T12: API scopes panel with admin sibling preserved
 *
 * Settings panel with two Mantine Checkbox.Group sections: API scopes (TARGET) and Admin scopes.
 * Overlapping labels between groups. API scopes initial: Read users, Billing access.
 * Admin scopes initial: Manage members (must remain unchanged).
 * Target API: Read users, Write users, Export data, Audit access. Confirm via "Save scopes".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Checkbox, Stack, Button, Divider, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const apiOptions = [
  'Read users', 'Write users', 'Export data', 'Audit access', 'Billing access', 'Token rotate',
];

const adminOptions = [
  'Read users', 'Write users', 'Manage members', 'Audit access', 'Billing access', 'Token rotate',
];

const targetSet = ['Read users', 'Write users', 'Export data', 'Audit access'];
const adminInitial = ['Manage members'];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [apiScopes, setApiScopes] = useState<string[]>(['Read users', 'Billing access']);
  const [adminScopes, setAdminScopes] = useState<string[]>(['Manage members']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(apiScopes, targetSet) && setsEqual(adminScopes, adminInitial)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, apiScopes, adminScopes, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', minHeight: '80vh' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
        <Text fw={600} size="lg" mb="xs">Scope Settings</Text>
        <Text size="sm" c="dimmed" mb="md">Manage API and admin access scopes</Text>

        <Text fw={500} mb={6}>API scopes</Text>
        <Checkbox.Group
          value={apiScopes}
          onChange={(vals) => { setApiScopes(vals); setSaved(false); }}
        >
          <Stack gap="xs">
            {apiOptions.map(opt => <Checkbox key={opt} value={opt} label={opt} />)}
          </Stack>
        </Checkbox.Group>

        <Divider my="md" />

        <Text fw={500} mb={6}>Admin scopes</Text>
        <Checkbox.Group
          value={adminScopes}
          onChange={(vals) => { setAdminScopes(vals); setSaved(false); }}
        >
          <Stack gap="xs">
            {adminOptions.map(opt => <Checkbox key={opt} value={opt} label={opt} />)}
          </Stack>
        </Checkbox.Group>

        <Divider my="md" />

        <Group justify="flex-end">
          <Button onClick={() => setSaved(true)}>Save scopes</Button>
        </Group>
      </Card>
    </div>
  );
}
