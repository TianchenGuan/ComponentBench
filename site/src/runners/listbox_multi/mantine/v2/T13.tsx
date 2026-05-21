'use client';

/**
 * listbox_multi-mantine-v2-T13: Team roles drawer with searchable checkbox list
 *
 * Drawer with one searchable Mantine Checkbox.Group labeled "Team roles" (30+ items).
 * Similar labels: Reviewer, Review owner, Reporter, Report viewer, Security liaison, etc.
 * Initial: Report viewer. Target: Reviewer, Reporter, Security liaison.
 * Confirm via "Apply roles". Dark theme.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Card, Text, Checkbox, Stack, Button, Drawer, TextInput, Group, ScrollArea,
  MantineProvider,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const allRoles = [
  'Admin', 'Auditor', 'Billing reviewer', 'Build engineer', 'Compliance lead',
  'Data analyst', 'Database admin', 'Deploy manager', 'Developer', 'DevOps lead',
  'Engineering lead', 'Incident commander', 'Infrastructure lead', 'Legal reviewer',
  'Network admin', 'On-call engineer', 'Operations lead', 'Platform engineer',
  'Product manager', 'QA lead', 'Release manager', 'Report viewer', 'Reporter',
  'Review owner', 'Reviewer', 'Scrum master', 'Security liaison', 'Security owner',
  'Site reliability engineer', 'Support lead', 'Technical writer', 'Triage lead',
];

const targetSet = ['Reviewer', 'Reporter', 'Security liaison'];

export default function T13({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Report viewer']);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const filtered = useMemo(
    () => allRoles.filter(r => r.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selected, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 24, background: '#1a1b1e', minHeight: '100vh' }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
          <Text fw={600} size="lg" mb="xs">Team Management</Text>
          <Text size="sm" c="dimmed" mb="md">Configure team role assignments</Text>
          <Button onClick={() => { setDrawerOpen(true); setSaved(false); }}>
            Add team roles
          </Button>
        </Card>

        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Add team roles"
          position="left"
          size="sm"
        >
          <Text fw={500} mb={8}>Team roles</Text>
          <TextInput
            placeholder="Search roles…"
            leftSection={<IconSearch size={14} />}
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
            mb="sm"
          />
          <ScrollArea h={320} style={{ border: '1px solid #373a40', borderRadius: 6, padding: 8 }}>
            <Checkbox.Group
              value={selected}
              onChange={(vals) => { setSelected(vals); setSaved(false); }}
            >
              <Stack gap="xs">
                {filtered.map(role => <Checkbox key={role} value={role} label={role} />)}
              </Stack>
            </Checkbox.Group>
          </ScrollArea>
          <Text size="sm" c="dimmed" mt="sm">Selected: {selected.length}</Text>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={() => { setSaved(true); setDrawerOpen(false); }}>Apply roles</Button>
          </Group>
        </Drawer>
      </div>
    </MantineProvider>
  );
}
