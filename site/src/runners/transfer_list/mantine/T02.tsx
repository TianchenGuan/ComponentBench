'use client';

/**
 * transfer_list-mantine-T02: Enable all modules
 *
 * Isolated card titled "Module access". Move-all (⇉/⇇) and move-selected (→/←) buttons.
 * 6 modules. No search. Success: right = all 6.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Button, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL = ['Analytics', 'Billing', 'Reporting', 'Integrations', 'Audit log', 'User management'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T02({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL]);
  const [right, setRight] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, ALL)) { successFired.current = true; onSuccess(); }
  }, [right, onSuccess]);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); setRight([...right, ...sel]); setLeft(not(left, sel)); setChecked(not(checked, sel)); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); setLeft([...left, ...sel]); setRight(not(right, sel)); setChecked(not(checked, sel)); };
  const moveAllRight = () => { setRight([...right, ...left]); setChecked(not(checked, left)); setLeft([]); };
  const moveAllLeft = () => { setLeft([...left, ...right]); setChecked(not(checked, right)); setRight([]); };

  const renderList = (title: string, items: string[]) => (
    <Paper withBorder p="xs" style={{ width: 220 }}>
      <Text fw={500} size="sm" mb={4}>{title}</Text>
      <ScrollArea h={220}>
        <Stack gap={2}>
          {items.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />)}
          {items.length === 0 && <Text size="xs" c="dimmed" ta="center">Empty</Text>}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 580 }}>
      <Text fw={500} size="lg" mb="md">Module access</Text>
      <Group align="center" gap="sm">
        {renderList('Disabled modules', left)}
        <Stack gap={4}>
          <Button size="xs" variant="default" onClick={moveAllRight} disabled={left.length === 0}>{'⇉'}</Button>
          <Button size="xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'→'}</Button>
          <Button size="xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'←'}</Button>
          <Button size="xs" variant="default" onClick={moveAllLeft} disabled={right.length === 0}>{'⇇'}</Button>
        </Stack>
        {renderList('Enabled', right)}
      </Group>
    </Card>
  );
}
