'use client';

/**
 * transfer_list-mantine-T05: Enable two push notification types in the correct panel
 *
 * Settings panel titled "Notifications" with tabs (General/Notifications/Privacy).
 * TWO transfer list instances: "Email notifications" and "Mobile push notifications" (target).
 * Success: Mobile push Enabled = Mentions, Direct messages.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Button, Group, Stack, Paper, ScrollArea, Tabs, Divider } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const NOTIF_OPTIONS = ['Mentions', 'Direct messages', 'New followers', 'Reactions', 'System alerts', 'Weekly summary'];
const TARGET = ['Mentions', 'Direct messages'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

function TransferBlock({ title, initialLeft, initialRight, onRightChange }: {
  title: string; initialLeft: string[]; initialRight: string[]; onRightChange?: (r: string[]) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>(initialLeft);
  const [right, setRight] = useState<string[]>(initialRight);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); const nr = [...right, ...sel]; setRight(nr); setLeft(not(left, sel)); setChecked(not(checked, sel)); onRightChange?.(nr); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); const nr = not(right, sel); setLeft([...left, ...sel]); setRight(nr); setChecked(not(checked, sel)); onRightChange?.(nr); };

  const renderList = (label: string, items: string[]) => (
    <Paper withBorder p="xs" style={{ width: 200 }}>
      <Text fw={500} size="xs" mb={4}>{label}</Text>
      <ScrollArea h={160}>
        <Stack gap={2}>
          {items.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="xs" />)}
          {items.length === 0 && <Text size="xs" c="dimmed" ta="center">Empty</Text>}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <div>
      <Text fw={600} size="sm" mb="xs">{title}</Text>
      <Group align="center" gap="xs">
        {renderList('Disabled', left)}
        <Stack gap={2}>
          <Button size="compact-xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
          <Button size="compact-xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
        </Stack>
        {renderList('Enabled', right)}
      </Group>
    </div>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const handlePushChange = (r: string[]) => {
    if (!successFired.current && setsEqual(r, TARGET)) { successFired.current = true; onSuccess(); }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 620 }}>
      <Tabs defaultValue="notifications">
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
          <Tabs.Tab value="privacy">Privacy</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="notifications" pt="md">
          <Text size="sm" c="dimmed" mb="md">Configure how you receive notifications.</Text>
          <Stack gap="lg">
            <TransferBlock title="Email notifications" initialLeft={NOTIF_OPTIONS.filter(o => o !== 'Weekly summary')} initialRight={['Weekly summary']} />
            <Divider />
            <TransferBlock title="Mobile push notifications" initialLeft={[...NOTIF_OPTIONS]} initialRight={[]} onRightChange={handlePushChange} />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="general" pt="md"><Text c="dimmed">General settings placeholder.</Text></Tabs.Panel>
        <Tabs.Panel value="privacy" pt="md"><Text c="dimmed">Privacy settings placeholder.</Text></Tabs.Panel>
      </Tabs>
    </Card>
  );
}
