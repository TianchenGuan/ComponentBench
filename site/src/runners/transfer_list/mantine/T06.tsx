'use client';

/**
 * transfer_list-mantine-T06: Customize columns in a drawer and save
 *
 * Main page: table preview + "Customize columns" button. Opens Mantine Drawer.
 * Inside drawer: transfer list Hidden/Visible + Cancel/Save buttons.
 * Initial Visible: Name, Status, Notes. Goal: Name, Status, Owner, Updated (remove Notes, add Owner+Updated).
 * Success: after Save, right = Name, Status, Owner, Updated.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Checkbox, Button, Group, Stack, Paper, ScrollArea, Drawer, Table, Divider } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const INITIAL_LEFT = ['Owner', 'Updated', 'Created', 'Priority'];
const INITIAL_RIGHT = ['Name', 'Status', 'Notes'];
const TARGET = ['Name', 'Status', 'Owner', 'Updated'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T06({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...INITIAL_LEFT]);
  const [right, setRight] = useState<string[]>([...INITIAL_RIGHT]);
  const [committedRight, setCommittedRight] = useState<string[]>([...INITIAL_RIGHT]);
  const successFired = useRef(false);

  const toggle = (v: string) => setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const moveRight = () => { const sel = checked.filter(v => left.includes(v)); setRight([...right, ...sel]); setLeft(not(left, sel)); setChecked(not(checked, sel)); };
  const moveLeft = () => { const sel = checked.filter(v => right.includes(v)); setLeft([...left, ...sel]); setRight(not(right, sel)); setChecked(not(checked, sel)); };

  const handleOpen = () => { setLeft(not([...INITIAL_LEFT, ...INITIAL_RIGHT], committedRight)); setRight([...committedRight]); setChecked([]); setDrawerOpen(true); };
  const handleCancel = () => setDrawerOpen(false);
  const handleSave = () => {
    setCommittedRight([...right]); setDrawerOpen(false);
    if (!successFired.current && setsEqual(right, TARGET)) { successFired.current = true; onSuccess(); }
  };

  const renderList = (title: string, items: string[]) => (
    <Paper withBorder p="xs" style={{ width: 180 }}>
      <Text fw={500} size="sm" mb={4}>{title}</Text>
      <ScrollArea h={200}>
        <Stack gap={2}>
          {items.map(v => <Checkbox key={v} label={v} checked={checked.includes(v)} onChange={() => toggle(v)} size="sm" />)}
          {items.length === 0 && <Text size="xs" c="dimmed" ta="center">Empty</Text>}
        </Stack>
      </ScrollArea>
    </Paper>
  );

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
        <Text fw={500} size="lg" mb="md">Data table</Text>
        <Table mb="md">
          <Table.Thead><Table.Tr>{committedRight.map(c => <Table.Th key={c}>{c}</Table.Th>)}</Table.Tr></Table.Thead>
          <Table.Tbody><Table.Tr>{committedRight.map(c => <Table.Td key={c}>—</Table.Td>)}</Table.Tr></Table.Tbody>
        </Table>
        <Button onClick={handleOpen} data-testid="customize-columns-btn">Customize columns</Button>
      </Card>

      <Drawer opened={drawerOpen} onClose={handleCancel} title="Columns" position="right" size="md">
        <Group align="center" gap="sm" mb="lg">
          {renderList('Hidden', left)}
          <Stack gap={4}>
            <Button size="xs" variant="default" onClick={moveRight} disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
            <Button size="xs" variant="default" onClick={moveLeft} disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
          </Stack>
          {renderList('Visible', right)}
        </Group>
        <Divider mb="md" />
        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} data-testid="save-columns-btn">Save</Button>
        </Group>
      </Drawer>
    </>
  );
}
