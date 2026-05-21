'use client';

/**
 * tree_grid-mantine-v2-T03: Status filter popover plus exact target row in finance branch
 *
 * Mantine composite tree grid with Status header popover filter. Set Status = Blocked via
 * "Apply filter", then select Finance → Invoicing and click "Use row".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, Popover, Radio, Stack } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconFilter } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

interface CatalogRow { key: string; service: string; status: string; owner: string; children?: CatalogRow[]; }

const DATA: CatalogRow[] = [
  { key: 'finance', service: 'Finance', status: 'Active', owner: 'Eve',
    children: [
      { key: 'finance/billing', service: 'Billing', status: 'Active', owner: 'Frank' },
      { key: 'finance/invoicing', service: 'Invoicing', status: 'Blocked', owner: 'Grace' },
    ],
  },
  { key: 'platform', service: 'Platform', status: 'Active', owner: 'Alice',
    children: [
      { key: 'platform/api-gateway', service: 'API Gateway', status: 'Active', owner: 'Bob' },
      { key: 'platform/auth-service', service: 'Auth Service', status: 'Blocked', owner: 'Carol' },
    ],
  },
];

function getPath(rows: CatalogRow[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.service];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.service, ...p]; }
  }
  return [];
}

function filterTree(rows: CatalogRow[], status: string): CatalogRow[] {
  if (!status) return rows;
  return rows.reduce<CatalogRow[]>((acc, row) => {
    const filtered = row.children ? filterTree(row.children, status) : undefined;
    if ((row.status === status) || (filtered && filtered.length > 0)) {
      acc.push({ ...row, children: filtered });
    }
    return acc;
  }, []);
}

function TreeRow({ row, depth, expanded, selectedKey, onToggle, onSelect }: {
  row: CatalogRow; depth: number; expanded: Set<string>; selectedKey: string | null;
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
        <Table.Td><Text size="sm">{row.status}</Text></Table.Td>
        <Table.Td><Text size="sm">{row.owner}</Text></Table.Td>
      </Table.Tr>
      {hasKids && isExp && row.children!.map(c => (
        <TreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded} selectedKey={selectedKey} onToggle={onToggle} onSelect={onSelect} />
      ))}
    </>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [draftFilter, setDraftFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const displayData = filterTree(DATA, statusFilter);
  const selectedPath = selectedKey ? getPath(DATA, selectedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (statusFilter === 'Blocked' && pathEquals(selectedPath, ['Finance', 'Invoicing'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, statusFilter, selectedPath, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 540 }}>
      <Text fw={500} size="lg" mb="md">Service Catalog</Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 200 }}>Service</Table.Th>
            <Table.Th style={{ width: 120 }}>
              <Group gap={4}>
                <span>Status</span>
                <Popover opened={popoverOpen} onChange={setPopoverOpen} position="bottom-start" withArrow>
                  <Popover.Target>
                    <ActionIcon variant="subtle" size="xs" onClick={() => { setPopoverOpen(true); setDraftFilter(statusFilter); }}>
                      <IconFilter size={12} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Stack gap="xs">
                      <Radio.Group value={draftFilter} onChange={setDraftFilter}>
                        <Stack gap={4}>
                          <Radio value="Active" label="Active" size="xs" />
                          <Radio value="Blocked" label="Blocked" size="xs" />
                        </Stack>
                      </Radio.Group>
                      <Group gap="xs">
                        <Button size="xs" onClick={() => { setStatusFilter(draftFilter); setPopoverOpen(false); }}>Apply filter</Button>
                        <Button size="xs" variant="subtle" onClick={() => { setDraftFilter(''); setStatusFilter(''); setPopoverOpen(false); }}>Clear</Button>
                      </Group>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            </Table.Th>
            <Table.Th>Owner</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {displayData.map(r => (
            <TreeRow key={r.key} row={r} depth={0} expanded={expanded} selectedKey={selectedKey} onToggle={toggle} onSelect={setSelectedKey} />
          ))}
        </Table.Tbody>
      </Table>
      <Button fullWidth mt="sm" onClick={() => setSaved(true)}>Use row</Button>
    </Card>
  );
}
