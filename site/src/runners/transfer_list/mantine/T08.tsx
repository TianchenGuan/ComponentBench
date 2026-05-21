'use client';

/**
 * transfer_list-mantine-T08: Scroll to move late records
 *
 * Isolated card titled "Dataset inclusion". 100 items (Record 001–Record 100).
 * Constrained height, must scroll. No search. Success: Included = Record 097, Record 100.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Button, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL = Array.from({ length: 100 }, (_, i) => `Record ${String(i + 1).padStart(3, '0')}`);
const TARGET = ['Record 097', 'Record 100'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T08({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL]);
  const [right, setRight] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, TARGET)) { successFired.current = true; onSuccess(); }
  }, [right, onSuccess]);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); setRight([...right, ...sel]); setLeft(not(left, sel)); setChecked(not(checked, sel)); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); setLeft([...left, ...sel]); setRight(not(right, sel)); setChecked(not(checked, sel)); };

  const renderList = (title: string, items: string[]) => (
    <Paper withBorder p="xs" style={{ width: 220 }}>
      <Text fw={500} size="sm" mb={4}>{title}</Text>
      <ScrollArea h={300}>
        <Stack gap={2}>
          {items.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />)}
          {items.length === 0 && <Text size="xs" c="dimmed" ta="center">Empty</Text>}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 580 }}>
      <Text fw={500} size="lg" mb="md">Dataset inclusion</Text>
      <Group align="center" gap="sm">
        {renderList('All records', left)}
        <Stack gap={4}>
          <Button size="xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Included', right)}
      </Group>
    </Card>
  );
}
