'use client';

/**
 * select_custom_multi-mantine-T07: Dark compact: choose similar permission strings
 *
 * Scene context: theme=dark, spacing=compact, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Theme: dark. Spacing: compact.
 * Layout: isolated card centered titled "Permissions".
 * Component: Mantine MultiSelect labeled "Granted permissions" with searchable enabled.
 * Options (24) include many similar strings, e.g.:
 *   Read: Projects, Read: Project settings, Read: People, Read: Billing,
 *   Write: Projects, Write: Project settings, Write: People, Write: Billing,
 *   Admin: Projects, Admin: People, Admin: Billing,
 *   plus other non-target permissions like Export: Reports, View: Audit log, etc.
 * The dropdown is scrollable; typing in the input filters results.
 * Initial state: preselected pills: Read: Projects and Write: People (distractors that must be removed/adjusted).
 * No Save button; pills update immediately.
 *
 * Success: The selected values are exactly: Read: People, Write: Projects, Admin: Billing (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const permissionOptions = [
  'Read: Projects', 'Read: Project settings', 'Read: People', 'Read: Billing',
  'Write: Projects', 'Write: Project settings', 'Write: People', 'Write: Billing',
  'Admin: Projects', 'Admin: People', 'Admin: Billing',
  'Export: Reports', 'Export: Data', 'View: Audit log', 'View: Analytics',
  'Manage: Users', 'Manage: Teams', 'Manage: Roles', 'Delete: Projects',
  'Delete: Data', 'Archive: Projects', 'Restore: Projects', 'Share: Reports', 'Share: Dashboards'
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Read: Projects', 'Write: People']);

  useEffect(() => {
    const targetSet = new Set(['Read: People', 'Write: Projects', 'Admin: Billing']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const content = (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Permissions</Text>
      <MultiSelect
        data-testid="permissions-select"
        label="Granted permissions"
        placeholder="Select permissions"
        data={permissionOptions}
        value={selected}
        onChange={setSelected}
        searchable
        maxDropdownHeight={250}
      />
    </Card>
  );

  if (task.scene_context.theme === 'dark') {
    return (
      <MantineProvider defaultColorScheme="dark">
        {content}
      </MantineProvider>
    );
  }

  return content;
}
