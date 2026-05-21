'use client';

/**
 * tree_grid-mantine-v2-T02: Write permissions composite grid in drawer – exact descendant checkbox set
 *
 * "Edit role" opens drawer. Two composite tree grids: "Read permissions" and "Write permissions".
 * In Write permissions, expand Platform, uncheck Logs (pre-checked), check Deployments + Incidents.
 * Click "Save permissions".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, Drawer, Checkbox, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

interface PermNode { key: string; name: string; children?: PermNode[]; }

const PERM_TREE: PermNode[] = [
  { key: 'platform', name: 'Platform', children: [
    { key: 'platform/deployments', name: 'Deployments' },
    { key: 'platform/incidents', name: 'Incidents' },
    { key: 'platform/logs', name: 'Logs' },
  ]},
  { key: 'finance', name: 'Finance', children: [
    { key: 'finance/billing', name: 'Billing' },
  ]},
];

function getPath(rows: PermNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

function PermTreeRow({ row, depth, expanded, checked, onToggle, onCheck }: {
  row: PermNode; depth: number; expanded: Set<string>; checked: Set<string>;
  onToggle: (k: string) => void; onCheck: (k: string) => void;
}) {
  const isExp = expanded.has(row.key);
  const hasKids = !!row.children?.length;
  return (
    <>
      <Table.Tr>
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 20 }}>
            {hasKids ? (
              <ActionIcon variant="subtle" size="sm" onClick={() => onToggle(row.key)}>
                {isExp ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
              </ActionIcon>
            ) : <Box style={{ width: 22 }} />}
            <Checkbox size="xs" checked={checked.has(row.key)} onChange={() => onCheck(row.key)} />
            <Text size="sm">{row.name}</Text>
          </Group>
        </Table.Td>
      </Table.Tr>
      {hasKids && isExp && row.children!.map(c => (
        <PermTreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded} checked={checked} onToggle={onToggle} onCheck={onCheck} />
      ))}
    </>
  );
}

function PermGrid({ title, checked, onCheckedChange }: {
  title: string; checked: Set<string>; onCheckedChange: (s: Set<string>) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const check = (k: string) => onCheckedChange((() => { const n = new Set(checked); n.has(k) ? n.delete(k) : n.add(k); return n; })());

  return (
    <div style={{ marginBottom: 16 }}>
      <Text fw={600} size="sm" mb={4}>{title}</Text>
      <Table>
        <Table.Thead><Table.Tr><Table.Th>Permission</Table.Th></Table.Tr></Table.Thead>
        <Table.Tbody>
          {PERM_TREE.map(r => <PermTreeRow key={r.key} row={r} depth={0} expanded={expanded} checked={checked} onToggle={toggle} onCheck={check} />)}
        </Table.Tbody>
      </Table>
    </div>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [readChecked, setReadChecked] = useState<Set<string>>(new Set());
  const [writeChecked, setWriteChecked] = useState<Set<string>>(new Set(['platform/logs']));
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const paths = Array.from(writeChecked).map(k => getPath(PERM_TREE, k));
    if (pathSetsEqual(paths, [['Platform', 'Deployments'], ['Platform', 'Incidents']])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, writeChecked, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <Text fw={500} size="lg" mb="md">Role Manager</Text>
        <Stack gap="xs">
          <Card withBorder padding="xs"><Text size="xs" c="dimmed">Audit entries: 8</Text></Card>
          <Card withBorder padding="xs"><Text size="xs" c="dimmed">Last review: Jan 10</Text></Card>
        </Stack>
        <Button mt="md" onClick={() => setDrawerOpen(true)}>Edit role</Button>
      </Card>
      <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} title="Edit role" position="right" size="md">
        <Stack gap="md" style={{ height: '100%' }}>
          <Box style={{ flex: 1 }}>
            <PermGrid title="Read permissions" checked={readChecked} onCheckedChange={setReadChecked} />
            <PermGrid title="Write permissions" checked={writeChecked} onCheckedChange={setWriteChecked} />
          </Box>
          <Button fullWidth onClick={() => setSaved(true)}>Save permissions</Button>
        </Stack>
      </Drawer>
    </>
  );
}
