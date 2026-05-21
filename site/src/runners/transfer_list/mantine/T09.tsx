'use client';

/**
 * transfer_list-mantine-T09: Update release approvers on a busy dashboard and save
 *
 * Dashboard with high clutter: sidebar, status cards, charts (non-functional).
 * THREE transfer list widgets: "Incident rotation", "Release approvers" (target), "On-call backup".
 * "Required" chips next to Release approvers title. Sticky "Save changes" button.
 * Initial Release approvers Selected: Ada Lovelace, Linus Torvalds (Linus is wrong).
 * Target: Ada Lovelace, Grace Hopper, Alan Turing. Must click Save changes.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Checkbox, Button, Group, Stack, Paper, ScrollArea, Badge, Box, Divider } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const PEOPLE = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Margaret Hamilton', 'Linus Torvalds', 'Dennis Ritchie', 'Barbara Liskov', 'Tim Berners-Lee'];
const TARGET = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

function TransferWidget({ title, initialLeft, initialRight, chips, onRightChange }: {
  title: string; initialLeft: string[]; initialRight: string[]; chips?: string[]; onRightChange?: (r: string[]) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>(initialLeft);
  const [right, setRight] = useState<string[]>(initialRight);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); const nr = [...right, ...sel]; setRight(nr); setLeft(not(left, sel)); setChecked(not(checked, sel)); onRightChange?.(nr); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); const nr = not(right, sel); setLeft([...left, ...sel]); setRight(nr); setChecked(not(checked, sel)); onRightChange?.(nr); };

  const renderList = (label: string, items: string[]) => (
    <Paper withBorder p={6} style={{ width: 170 }}>
      <Text fw={500} size="xs" mb={2}>{label}</Text>
      <ScrollArea h={140}>
        <Stack gap={1}>
          {items.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="xs" styles={{ label: { fontSize: 11 } }} />)}
          {items.length === 0 && <Text size="xs" c="dimmed" ta="center">—</Text>}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <Card withBorder p="sm" mb="sm">
      <Group gap={6} mb="xs">
        <Text fw={600} size="sm">{title}</Text>
        {chips && chips.map(c => <Badge key={c} size="xs" variant="light">Required: {c}</Badge>)}
      </Group>
      <Group align="center" gap={4}>
        {renderList('Available', left)}
        <Stack gap={2}>
          <Button size="compact-xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="compact-xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Selected', right)}
      </Group>
    </Card>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const latestRight = useRef<string[]>([]);

  const handleReleaseChange = (r: string[]) => { latestRight.current = r; };
  const handleSave = () => {
    if (!successFired.current && setsEqual(latestRight.current, TARGET)) { successFired.current = true; onSuccess(); }
  };

  return (
    <Box style={{ display: 'flex', width: 800 }}>
      <Paper withBorder p="sm" mr="sm" style={{ width: 140, flexShrink: 0 }}>
        <Text fw={600} size="sm" mb="sm">Dashboard</Text>
        {['Overview', 'Teams', 'Releases', 'Incidents', 'Settings'].map(item => (
          <Text key={item} size="xs" py={4} c={item === 'Releases' ? 'blue' : 'dimmed'}>{item}</Text>
        ))}
      </Paper>

      <Box style={{ flex: 1 }}>
        <Paper withBorder p="xs" mb="sm" style={{ position: 'sticky', top: 0, zIndex: 1, background: '#fff' }}>
          <Group justify="space-between">
            <Text fw={600}>Team Operations</Text>
            <Button size="xs" onClick={handleSave} data-testid="save-changes-btn">Save changes</Button>
          </Group>
        </Paper>

        <Group mb="sm" gap="sm">
          <Paper withBorder p="xs" style={{ flex: 1 }}><Text size="xs" c="dimmed">Active incidents</Text><Text fw={700} size="xl">3</Text></Paper>
          <Paper withBorder p="xs" style={{ flex: 1 }}><Text size="xs" c="dimmed">Pending releases</Text><Text fw={700} size="xl">7</Text></Paper>
          <Paper withBorder p="xs" style={{ flex: 1 }}><Text size="xs" c="dimmed">On-call</Text><Text fw={700} size="xl">2</Text></Paper>
        </Group>

        <TransferWidget title="Incident rotation" initialLeft={PEOPLE.filter(p => p !== 'Dennis Ritchie')} initialRight={['Dennis Ritchie']} />
        <TransferWidget title="Release approvers" initialLeft={PEOPLE.filter(p => !['Ada Lovelace', 'Linus Torvalds'].includes(p))} initialRight={['Ada Lovelace', 'Linus Torvalds']} chips={TARGET} onRightChange={handleReleaseChange} />
        <TransferWidget title="On-call backup" initialLeft={PEOPLE.filter(p => p !== 'Margaret Hamilton')} initialRight={['Margaret Hamilton']} />
      </Box>
    </Box>
  );
}
