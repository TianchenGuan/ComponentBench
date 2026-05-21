'use client';

/**
 * select_custom_multi-mantine-v2-T13: Reference permissions card on custom combobox
 *
 * Dashboard panel, dark theme, small scale, compact spacing, top-right placement, medium clutter.
 * Read-only chip row "Reference permissions": Export, View audit log, Manage billing, Read.
 * Below: Combobox-based multiselect (Mantine MultiSelect) labeled "Effective permissions".
 * Options: Export, Export CSV, View audit log, View audit logs (archived), Manage billing,
 *          Manage billing (view), Read, Read-only, Write, Delete.
 * Initial: [Export CSV, Read-only]. Target: match reference = {Export, View audit log, Manage billing, Read}.
 * Auto-apply (no save button).
 *
 * Success: Effective permissions = {Export, View audit log, Manage billing, Read}.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, MultiSelect, Badge, Group, Stack, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const permissionOptions = [
  'Export', 'Export CSV', 'View audit log', 'View audit logs (archived)',
  'Manage billing', 'Manage billing (view)', 'Read', 'Read-only', 'Write', 'Delete',
];

const referencePermissions = ['Export', 'View audit log', 'Manage billing', 'Read'];

export default function T13({ onSuccess }: TaskComponentProps) {
  const [effectivePerms, setEffectivePerms] = useState<string[]>(['Export CSV', 'Read-only']);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (setsEqual(effectivePerms, referencePermissions)) {
      successFired.current = true;
      onSuccess();
    }
  }, [effectivePerms, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 16, background: '#1a1a1a', minHeight: '100vh' }}>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 420, background: '#242424' }}>
          <Text fw={600} size="lg" mb="sm" c="white">Permissions</Text>

          <div style={{ marginBottom: 16 }}>
            <Text size="xs" c="dimmed" mb={4}>Reference permissions</Text>
            <Group gap="xs">
              {referencePermissions.map(p => (
                <Badge key={p} variant="outline" color="blue" size="sm">{p}</Badge>
              ))}
            </Group>
          </div>

          <MultiSelect
            label="Effective permissions"
            searchable
            clearable
            data={permissionOptions}
            value={effectivePerms}
            onChange={setEffectivePerms}
            placeholder="Select permissions"
          />
        </Card>
      </div>
    </MantineProvider>
  );
}
