'use client';

/**
 * tree_grid-mantine-v2-T08: People/IT request scope – same-row chevrons and checkboxes with exact set
 *
 * "Request scope" tree grid. Expand People → IT, check ONLY Laptop Requests and VPN Access.
 * Do not check parent rows. Click "Apply request scope".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, Checkbox, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

interface ScopeNode { key: string; name: string; children?: ScopeNode[]; }

const DATA: ScopeNode[] = [
  { key: 'people', name: 'People', children: [
    { key: 'people/it', name: 'IT', children: [
      { key: 'people/it/laptop-requests', name: 'Laptop Requests' },
      { key: 'people/it/vpn-access', name: 'VPN Access' },
      { key: 'people/it/badge-access', name: 'Badge Access' },
    ]},
  ]},
  { key: 'hr', name: 'HR', children: [
    { key: 'hr/onboarding', name: 'Onboarding' },
  ]},
];

function getPath(rows: ScopeNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

function TreeRow({ row, depth, expanded, checked, onToggle, onCheck }: {
  row: ScopeNode; depth: number; expanded: Set<string>; checked: Set<string>;
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
        <TreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded} checked={checked} onToggle={onToggle} onCheck={onCheck} />
      ))}
    </>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const check = (k: string) => setChecked(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  useEffect(() => {
    if (successFired.current || !saved) return;
    const paths = Array.from(checked).map(k => getPath(DATA, k));
    if (pathSetsEqual(paths, [['People', 'IT', 'Laptop Requests'], ['People', 'IT', 'VPN Access']])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, checked, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="sm">Request scope</Text>
      <Text size="xs" c="dimmed" mb="sm">Select the IT requests to include in the scope.</Text>
      <Table>
        <Table.Thead><Table.Tr><Table.Th>Service</Table.Th></Table.Tr></Table.Thead>
        <Table.Tbody>
          {DATA.map(r => <TreeRow key={r.key} row={r} depth={0} expanded={expanded} checked={checked} onToggle={toggle} onCheck={check} />)}
        </Table.Tbody>
      </Table>
      <Button fullWidth mt="sm" onClick={() => setSaved(true)}>Apply request scope</Button>
    </Card>
  );
}
