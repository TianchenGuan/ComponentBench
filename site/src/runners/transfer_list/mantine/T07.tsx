'use client';

/**
 * transfer_list-mantine-T07: Match access roles with a visual reference in small scale
 *
 * Isolated card. "Required roles" chips at top as visual reference.
 * Transfer list with 40 role labels (near-duplicates). Small scale.
 * Initial Selected: View-only, Commenter (incorrect). Target: Viewer, Editor, Admin, Owner.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Button, Group, Stack, Paper, ScrollArea, Badge } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_ROLES = [
  'Viewer', 'View-only', 'View + comment', 'Commenter', 'Comment-only',
  'Editor', 'Editor (limited)', 'Editor (full)', 'Editor (draft)', 'Editor (review)',
  'Admin', 'Admin (billing)', 'Admin (users)', 'Admin (security)', 'Admin (read-only)',
  'Owner', 'Owner (workspace)', 'Owner (billing)', 'Owner (transfer)', 'Owner (legacy)',
  'Contributor', 'Contributor (external)', 'Contributor (internal)', 'Contributor (limited)',
  'Manager', 'Manager (team)', 'Manager (project)', 'Manager (department)',
  'Auditor', 'Auditor (external)', 'Auditor (internal)',
  'Guest', 'Guest (limited)', 'Guest (temporary)',
  'Operator', 'Operator (read)', 'Operator (write)',
  'Support', 'Support (tier 1)', 'Support (tier 2)',
];
const INITIAL_RIGHT = ['View-only', 'Commenter'];
const INITIAL_LEFT = ALL_ROLES.filter(r => !INITIAL_RIGHT.includes(r));
const TARGET = ['Viewer', 'Editor', 'Admin', 'Owner'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T07({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...INITIAL_LEFT]);
  const [right, setRight] = useState<string[]>([...INITIAL_RIGHT]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, TARGET)) { successFired.current = true; onSuccess(); }
  }, [right, onSuccess]);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); setRight([...right, ...sel]); setLeft(not(left, sel)); setChecked(not(checked, sel)); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); setLeft([...left, ...sel]); setRight(not(right, sel)); setChecked(not(checked, sel)); };

  const renderList = (title: string, items: string[]) => (
    <Paper withBorder p={6} style={{ width: 200 }}>
      <Text fw={500} size="xs" mb={2}>{title}</Text>
      <ScrollArea h={300}>
        <Stack gap={1}>
          {items.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="xs" styles={{ label: { fontSize: 12 } }} />)}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 540 }}>
      <Text fw={500} size="lg" mb={4}>Access roles</Text>
      <Group gap={6} mb="md">
        <Text size="xs" c="dimmed">Required roles:</Text>
        {TARGET.map(r => <Badge key={r} size="sm" variant="outline">{r}</Badge>)}
      </Group>
      <Group align="center" gap="xs">
        {renderList('All roles', left)}
        <Stack gap={2}>
          <Button size="compact-xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="compact-xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Selected', right)}
      </Group>
    </Card>
  );
}
