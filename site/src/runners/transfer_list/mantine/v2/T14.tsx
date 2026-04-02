'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, Checkbox, Group, Stack, Paper, ScrollArea, Badge, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const REFERENCE = ['Viewer', 'Commenter', 'Editor', 'Admin (billing)'];

const allRoles = [
  'Viewer', 'View-only', 'Commenter', 'Commenter (internal)',
  'Editor', 'Editor (limited)', 'Admin', 'Admin (billing)', 'Owner',
];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T14({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState(not(allRoles, ['View-only', 'Commenter (internal)']));
  const [right, setRight] = useState(['View-only', 'Commenter (internal)']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, REFERENCE)) {
      successFired.current = true;
      onSuccess();
    }
  }, [right, onSuccess]);

  const toggle = (v: string) =>
    setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const moveRight = () => {
    const sel = checked.filter(v => left.includes(v));
    setRight(prev => [...prev, ...sel]);
    setLeft(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const moveLeft = () => {
    const sel = checked.filter(v => right.includes(v));
    setLeft(prev => [...prev, ...sel]);
    setRight(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const renderList = (title: string, items: string[]) => (
    <Paper withBorder p="xs" style={{ width: 200, background: '#1a1a2e', border: '2px solid #444' }}>
      <Text fw={600} size="sm" mb={4} c="gray.3">{title}</Text>
      <ScrollArea h={220}>
        <Stack gap={2}>
          {items.map(v => (
            <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" color="blue" styles={{ label: { color: '#ccc' } }} />
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <MantineProvider forceColorScheme="dark">
    <div style={{ padding: 16, maxWidth: 540, marginLeft: 'auto', marginRight: 24, marginTop: 16 }}>
      <Text fw={600} size="md" mb="xs" c="gray.2">Access roles</Text>
      <div style={{ marginBottom: 12 }}>
        <Text size="xs" c="dimmed" mb={4}>Required roles</Text>
        <Group gap={4}>
          {REFERENCE.map(r => <Badge key={r} variant="filled" color="blue" size="sm">{r}</Badge>)}
        </Group>
      </div>
      <Group align="center" gap="sm">
        {renderList('Available', left)}
        <Stack gap={4}>
          <Button size="xs" variant="default" onClick={moveRight}
            disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="xs" variant="default" onClick={moveLeft}
            disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Selected', right)}
      </Group>
    </div>
    </MantineProvider>
  );
}
