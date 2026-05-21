'use client';

/**
 * transfer_list-mantine-T01: Pick two fruits
 *
 * Isolated card titled "Fruit selection". Mantine Combobox-based transfer list.
 * Columns: "Available" (left) / "Selected" (right) with search inputs above each list.
 * 8 fruit items. Success: Selected = Apples, Bananas.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Checkbox, Button, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL = ['Apples', 'Bananas', 'Grapes', 'Oranges', 'Strawberries', 'Blueberries', 'Mangoes', 'Pineapple'];
const TARGET = ['Apples', 'Bananas'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T01({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL]);
  const [right, setRight] = useState<string[]>([]);
  const [leftFilter, setLeftFilter] = useState('');
  const [rightFilter, setRightFilter] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, TARGET)) { successFired.current = true; onSuccess(); }
  }, [right, onSuccess]);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); setRight([...right, ...sel]); setLeft(not(left, sel)); setChecked(not(checked, sel)); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); setLeft([...left, ...sel]); setRight(not(right, sel)); setChecked(not(checked, sel)); };

  const renderList = (title: string, items: string[], filter: string, setFilter: (v: string) => void) => {
    const filtered = filter ? items.filter(v => v.toLowerCase().includes(filter.toLowerCase())) : items;
    return (
      <Paper withBorder p="xs" style={{ width: 220 }}>
        <Text fw={500} size="sm" mb={4}>{title}</Text>
        <TextInput size="xs" placeholder="Search..." value={filter} onChange={e => setFilter(e.target.value)} mb={8} />
        <ScrollArea h={220}>
          <Stack gap={2}>
            {filtered.map(v => (
              <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />
            ))}
            {filtered.length === 0 && <Text size="xs" c="dimmed" ta="center">No items</Text>}
          </Stack>
        </ScrollArea>
      </Paper>
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 580 }}>
      <Text fw={500} size="lg" mb="md">Fruit selection</Text>
      <Group align="center" gap="sm">
        {renderList('Available', left, leftFilter, setLeftFilter)}
        <Stack gap={4}>
          <Button size="xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Selected', right, rightFilter, setRightFilter)}
      </Group>
    </Card>
  );
}
