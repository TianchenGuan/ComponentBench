'use client';

/**
 * transfer_list-mantine-T10: Transfer all matching search results
 *
 * Isolated card titled "Permission builder". Search input above left list.
 * Special "Add all results" button transfers all currently filtered items.
 * 25 permissions, 4 contain "Admin". Success: Selected = the 4 Admin permissions only.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Checkbox, Button, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL = [
  'Admin - Billing', 'Admin - Users', 'Admin - Integrations', 'Admin - Security',
  'Viewer', 'Viewer (limited)', 'Editor', 'Editor (draft)', 'Editor (publish)',
  'Export CSV', 'Export PDF', 'Delete records', 'Delete users',
  'Manage billing', 'Manage teams', 'Manage integrations',
  'View audit log', 'View analytics', 'View reports',
  'Create projects', 'Archive projects', 'Transfer ownership',
  'API access', 'Webhook management', 'SSO configuration',
];
const TARGET = ['Admin - Billing', 'Admin - Users', 'Admin - Integrations', 'Admin - Security'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T10({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL]);
  const [right, setRight] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const successFired = useRef(false);

  const filtered = filter ? left.filter(v => v.toLowerCase().includes(filter.toLowerCase())) : left;

  useEffect(() => {
    if (!successFired.current && setsEqual(right, TARGET)) { successFired.current = true; onSuccess(); }
  }, [right, onSuccess]);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); setRight([...right, ...sel]); setLeft(not(left, sel)); setChecked(not(checked, sel)); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); setLeft([...left, ...sel]); setRight(not(right, sel)); setChecked(not(checked, sel)); };
  const addAllResults = () => { setRight([...right, ...filtered]); setLeft(not(left, filtered)); setChecked(not(checked, filtered)); };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 620 }}>
      <Text fw={500} size="lg" mb="md">Permission builder</Text>
      <Group align="flex-start" gap="sm">
        <Paper withBorder p="xs" style={{ width: 230 }}>
          <Text fw={500} size="sm" mb={4}>Available permissions</Text>
          <TextInput size="xs" placeholder="Search available" value={filter} onChange={e => setFilter(e.target.value)} mb={8} data-testid="search-available" />
          <ScrollArea h={280}>
            <Stack gap={2}>
              {filtered.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />)}
              {filtered.length === 0 && <Text size="xs" c="dimmed" ta="center">No matches</Text>}
            </Stack>
          </ScrollArea>
        </Paper>
        <Stack gap={4} mt={60}>
          <Button size="xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="xs" variant="filled" onClick={addAllResults} disabled={filtered.length === 0} data-testid="add-all-results">Add all results</Button>
          <Button size="xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        <Paper withBorder p="xs" style={{ width: 230 }}>
          <Text fw={500} size="sm" mb={4}>Selected</Text>
          <ScrollArea h={310}>
            <Stack gap={2}>
              {right.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />)}
              {right.length === 0 && <Text size="xs" c="dimmed" ta="center">Empty</Text>}
            </Stack>
          </ScrollArea>
        </Paper>
      </Group>
    </Card>
  );
}
