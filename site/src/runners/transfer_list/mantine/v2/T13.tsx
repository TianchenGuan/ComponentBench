'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, Checkbox, Group, Stack, Paper, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const services = Array.from({ length: 100 }, (_, i) =>
  `Service ${String(i + 1).padStart(2, '0')}`
);

const TARGET = ['Service 84', 'Service 87', 'Service 91', 'Service 96'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T13({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState(not(services, ['Service 10']));
  const [right, setRight] = useState(['Service 10']);
  const [committed, setCommitted] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && committed && setsEqual(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

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
    <Paper withBorder p="xs" style={{ width: 220, background: '#25262b' }}>
      <Text fw={500} size="sm" mb={4} c="gray.3">{title}</Text>
      <ScrollArea h={340}>
        <Stack gap={2}>
          {items.map(v => (
            <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <div style={{ background: '#1a1b1e', minHeight: '100vh', padding: 24, paddingLeft: 80 }}>
      <Text fw={600} size="lg" c="gray.2" mb="xs">Allowed services</Text>
      <Text size="sm" c="dimmed" mb="md">Select services to include in the allowlist.</Text>
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
      <Button mt="md" onClick={() => setCommitted([...right])}>Save allowlist</Button>
    </div>
  );
}
