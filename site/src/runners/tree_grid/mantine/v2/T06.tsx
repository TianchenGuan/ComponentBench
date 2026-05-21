'use client';

/**
 * tree_grid-mantine-v2-T06: Composite grid reset – clear search, filter chip, selection, and expansions
 *
 * Initial: search "auth", filter chip "Status: Active", selected Platform → Auth Service, expanded Platform.
 * Clear all and click "Apply view".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, TextInput, Badge, Stack, CloseButton } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../../types';
import { SERVICE_CATALOG_DATA } from '../../types';

function filterTree(rows: TreeGridRow[], text: string, status: string): TreeGridRow[] {
  return rows.reduce<TreeGridRow[]>((acc, row) => {
    const filtered = row.children ? filterTree(row.children, text, status) : undefined;
    const textMatch = !text || row.service.toLowerCase().includes(text.toLowerCase());
    const statusMatch = !status || row.status === status;
    const childMatch = filtered && filtered.length > 0;
    if ((textMatch && statusMatch) || childMatch) {
      acc.push({ ...row, children: filtered });
    }
    return acc;
  }, []);
}

function TreeRow({ row, depth, expanded, selectedKey, onToggle, onSelect }: {
  row: TreeGridRow; depth: number; expanded: Set<string>; selectedKey: string | null;
  onToggle: (k: string) => void; onSelect: (k: string | null) => void;
}) {
  const isExp = expanded.has(row.key);
  const isSel = selectedKey === row.key;
  const hasKids = !!row.children?.length;
  return (
    <>
      <Table.Tr
        style={{ cursor: 'pointer', backgroundColor: isSel ? 'var(--mantine-color-blue-light)' : undefined }}
        onClick={() => onSelect(isSel ? null : row.key)}
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
        <Table.Td><Text size="sm">{row.status}</Text></Table.Td>
        <Table.Td><Text size="sm">{row.lastUpdated}</Text></Table.Td>
      </Table.Tr>
      {hasKids && isExp && row.children!.map(c => (
        <TreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded} selectedKey={selectedKey} onToggle={onToggle} onSelect={onSelect} />
      ))}
    </>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [searchText, setSearchText] = useState('auth');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['platform']));
  const [selectedKey, setSelectedKey] = useState<string | null>('platform/auth-service');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const displayData = filterTree(SERVICE_CATALOG_DATA, searchText, statusFilter);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const clean =
      searchText === '' &&
      statusFilter === '' &&
      selectedKey === null &&
      expanded.size === 0;
    if (clean) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, searchText, statusFilter, selectedKey, expanded, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="lg" mb="sm">Service Catalog</Text>
      <Group mb="xs">
        <Card withBorder padding="xs" style={{ flex: 1 }}><Text size="xs" c="dimmed">Widget A</Text></Card>
        <Card withBorder padding="xs" style={{ flex: 1 }}><Text size="xs" c="dimmed">Widget B</Text></Card>
      </Group>
      <TextInput
        size="xs"
        placeholder="Search…"
        leftSection={<IconSearch size={14} />}
        value={searchText}
        onChange={e => setSearchText(e.currentTarget.value)}
        rightSection={searchText ? <CloseButton size="xs" onClick={() => setSearchText('')} /> : null}
        mb="xs"
      />
      {statusFilter && (
        <Group mb="xs">
          <Badge size="sm" variant="outline" rightSection={
            <CloseButton size={12} onClick={() => setStatusFilter('')} />
          }>
            Status: {statusFilter}
          </Badge>
        </Group>
      )}
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 220 }}>Service</Table.Th>
            <Table.Th style={{ width: 100 }}>Status</Table.Th>
            <Table.Th>Last updated</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {displayData.map(r => (
            <TreeRow key={r.key} row={r} depth={0} expanded={expanded} selectedKey={selectedKey} onToggle={toggle} onSelect={setSelectedKey} />
          ))}
        </Table.Tbody>
      </Table>
      <Button fullWidth mt="sm" onClick={() => setSaved(true)}>Apply view</Button>
    </Card>
  );
}
