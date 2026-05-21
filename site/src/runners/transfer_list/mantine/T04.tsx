'use client';

/**
 * transfer_list-mantine-T04: Search and add two vegetables in dark theme
 *
 * Dark theme. Isolated card titled "Meal planner". Search input above left list.
 * 30 ingredients. Success: Selected = Broccoli, Carrots.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Checkbox, Button, Group, Stack, Paper, ScrollArea, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL = [
  'Artichoke', 'Asparagus', 'Beet', 'Bell pepper', 'Broccoli', 'Brussels sprouts',
  'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Corn', 'Cucumber',
  'Eggplant', 'Fennel', 'Garlic', 'Green beans', 'Kale', 'Leek',
  'Lettuce', 'Mushroom', 'Onion', 'Parsnip', 'Peas', 'Pepper',
  'Potato', 'Radish', 'Spinach', 'Squash', 'Tomato', 'Zucchini',
];
const TARGET = ['Broccoli', 'Carrots'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T04({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL]);
  const [right, setRight] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, TARGET)) { successFired.current = true; onSuccess(); }
  }, [right, onSuccess]);

  const filtered = filter ? left.filter(v => v.toLowerCase().includes(filter.toLowerCase())) : left;
  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); setRight([...right, ...sel]); setLeft(not(left, sel)); setChecked(not(checked, sel)); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); setLeft([...left, ...sel]); setRight(not(right, sel)); setChecked(not(checked, sel)); };

  return (
    <MantineProvider forceColorScheme="dark">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 580 }}>
        <Text fw={500} size="lg" mb="md">Meal planner</Text>
        <Group align="flex-start" gap="sm">
          <Paper withBorder p="xs" style={{ width: 220 }}>
            <Text fw={500} size="sm" mb={4}>Available ingredients</Text>
            <TextInput size="xs" placeholder="Search available" value={filter} onChange={e => setFilter(e.target.value)} mb={8} data-testid="search-available" />
            <ScrollArea h={250}>
              <Stack gap={2}>
                {filtered.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />)}
                {filtered.length === 0 && <Text size="xs" c="dimmed" ta="center">No matches</Text>}
              </Stack>
            </ScrollArea>
          </Paper>
          <Stack gap={4} mt={60}>
            <Button size="xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
            <Button size="xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
          </Stack>
          <Paper withBorder p="xs" style={{ width: 220 }}>
            <Text fw={500} size="sm" mb={4}>Selected</Text>
            <ScrollArea h={280}>
              <Stack gap={2}>
                {right.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />)}
                {right.length === 0 && <Text size="xs" c="dimmed" ta="center">Empty</Text>}
              </Stack>
            </ScrollArea>
          </Paper>
        </Group>
      </Card>
    </MantineProvider>
  );
}
