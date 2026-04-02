'use client';

/**
 * tree_grid-mantine-v2-T05: Reference-guided deep asset row in compact AppShell grid
 *
 * Reference card: "Operations / Data Centers / US-West / Rack 21 / Cooling Unit".
 * Mantine composite tree grid with fixed-height body. Select that row, click "Apply selection".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, Badge, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../../types';

function TreeRow({ row, depth, expanded, selectedKey, onToggle, onSelect }: {
  row: TreeGridRow; depth: number; expanded: Set<string>; selectedKey: string | null;
  onToggle: (k: string) => void; onSelect: (k: string) => void;
}) {
  const isExp = expanded.has(row.key);
  const isSel = selectedKey === row.key;
  const hasKids = !!row.children?.length;
  return (
    <>
      <Table.Tr
        style={{ cursor: 'pointer', backgroundColor: isSel ? 'var(--mantine-color-blue-light)' : undefined }}
        onClick={() => onSelect(row.key)}
      >
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 20 }}>
            {hasKids ? (
              <ActionIcon variant="subtle" size="sm" onClick={e => { e.stopPropagation(); onToggle(row.key); }}>
                {isExp ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
              </ActionIcon>
            ) : <Box style={{ width: 22 }} />}
            <Text size="sm">{row.service}</Text>
          </Group>
        </Table.Td>
        <Table.Td><Text size="sm">{row.owner}</Text></Table.Td>
        <Table.Td><Text size="sm">{row.status}</Text></Table.Td>
      </Table.Tr>
      {hasKids && isExp && row.children!.map(c => (
        <TreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded} selectedKey={selectedKey} onToggle={onToggle} onSelect={onSelect} />
      ))}
    </>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (pathEquals(selectedPath, ['Operations', 'Data Centers', 'US-West', 'Rack 21', 'Cooling Unit'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selectedPath, onSuccess]);

  return (
    <Stack gap="sm" style={{ width: 520 }}>
      <Card withBorder padding="xs">
        <Text size="xs" c="dimmed" mb={4}>Reference path:</Text>
        <Group gap={4}>
          {['Operations', 'Data Centers', 'US-West', 'Rack 21', 'Cooling Unit'].map((s, i) => (
            <Badge key={i} size="sm" variant="outline">{s}</Badge>
          ))}
        </Group>
      </Card>
      <Group gap="sm" align="flex-start">
        <Card withBorder padding="xs" style={{ width: 100 }}>
          <Text size="xs" fw={500}>Summary</Text>
          <Text size="xs" c="dimmed">Groups: 5</Text>
          <Text size="xs" c="dimmed">Items: 120+</Text>
        </Card>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
          <Text fw={500} mb="xs">Asset inventory</Text>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 220 }}>Service</Table.Th>
                  <Table.Th style={{ width: 120 }}>Owner</Table.Th>
                  <Table.Th style={{ width: 80 }}>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {SERVICE_CATALOG_DATA.map(r => (
                  <TreeRow key={r.key} row={r} depth={0} expanded={expanded} selectedKey={selectedKey} onToggle={toggle} onSelect={setSelectedKey} />
                ))}
              </Table.Tbody>
            </Table>
          </div>
          <Button fullWidth mt="sm" onClick={() => setSaved(true)}>Apply selection</Button>
        </Card>
      </Group>
    </Stack>
  );
}
