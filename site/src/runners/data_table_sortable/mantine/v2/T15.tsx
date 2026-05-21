'use client';

/**
 * data_table_sortable-mantine-v2-T15: Leads card – match the visual score reference
 *
 * A dashboard_panel contains a Mantine DataTable card titled "Leads" and a smaller
 * "Reference preview" card to its right. The preview shows the Score header with a
 * downward chevron and a tiny top-three ordering (visual-only, no text instruction).
 * A non-functional search box and a stats card act as distractors.
 *
 * Success: Leads sorted by Score descending (one key only).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, TextInput, Paper, SimpleGrid, Badge } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../../types';

type Dir = 'asc' | 'desc' | null;
interface SortState { column: string | null; direction: Dir; }

interface ThProps { children: React.ReactNode; sortable?: boolean; sorted?: boolean; reversed?: boolean; onSort?: () => void; }
function Th({ children, sortable, sorted, reversed, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  if (!sortable) return <Table.Th>{children}</Table.Th>;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={500} size="sm">{children}</Text>
          <Center><Icon size={14} stroke={1.5} /></Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

interface LeadRow { id: string; name: string; company: string; score: number; lastContact: string; }

const leadsData: LeadRow[] = [
  { id: '1', name: 'Alpha lead', company: 'Acme', score: 92, lastContact: '2024-02-14' },
  { id: '2', name: 'Beta lead', company: 'TechStart', score: 55, lastContact: '2024-02-10' },
  { id: '3', name: 'Gamma lead', company: 'GlobalSys', score: 78, lastContact: '2024-02-12' },
  { id: '4', name: 'Delta lead', company: 'DataFlow', score: 100, lastContact: '2024-02-08' },
  { id: '5', name: 'Epsilon lead', company: 'CloudNet', score: 84, lastContact: '2024-02-15' },
  { id: '6', name: 'Zeta lead', company: 'InnoLabs', score: 30, lastContact: '2024-02-01' },
  { id: '7', name: 'Eta lead', company: 'QuickShip', score: 67, lastContact: '2024-02-13' },
  { id: '8', name: 'Theta lead', company: 'FinHub', score: 45, lastContact: '2024-02-06' },
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const successFired = useRef(false);

  const toggle = (col: string) => {
    setSort(prev => {
      if (prev.column === col) {
        if (prev.direction === 'asc') return { column: col, direction: 'desc' };
        if (prev.direction === 'desc') return { column: null, direction: null };
        return { column: col, direction: 'asc' };
      }
      return { column: col, direction: 'asc' };
    });
  };

  useEffect(() => {
    if (successFired.current) return;
    if (sort.column === 'score' && sort.direction === 'desc') {
      successFired.current = true;
      onSuccess();
    }
  }, [sort, onSuccess]);

  const sortedData = React.useMemo(() => {
    if (!sort.column || !sort.direction) return leadsData;
    return [...leadsData].sort((a, b) => {
      const aV = a[sort.column! as keyof LeadRow];
      const bV = b[sort.column! as keyof LeadRow];
      if (typeof aV === 'number' && typeof bV === 'number') return sort.direction === 'asc' ? aV - bV : bV - aV;
      return 0;
    });
  }, [sort]);

  const sortModel: SortModel = sort.column && sort.direction
    ? [{ column_key: sort.column, direction: sort.direction, priority: 1 }]
    : [];

  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: 24 }}>
      <div style={{ flex: '0 0 520px' }}>
        <TextInput placeholder="Search leads…" leftSection={<IconSearch size={14} />} mb="sm" readOnly />
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Text fw={600} size="sm" mb="xs">Leads</Text>
          <Table highlightOnHover data-testid="table-leads" data-sort-model={JSON.stringify(sortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th sortable sorted={sort.column === 'score'} reversed={sort.direction === 'desc'} onSort={() => toggle('score')}>Score</Th>
                <Th sortable sorted={sort.column === 'lastContact'} reversed={sort.direction === 'desc'} onSort={() => toggle('lastContact')}>Last contact</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedData.map(r => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.name}</Table.Td>
                  <Table.Td>{r.company}</Table.Td>
                  <Table.Td>{r.score}</Table.Td>
                  <Table.Td>{r.lastContact}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </div>

      <div style={{ flex: '0 0 180px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card shadow="sm" padding="sm" radius="md" withBorder style={{ background: '#f8f9fa' }}>
          <Text size="xs" c="dimmed" mb={4}>Reference preview</Text>
          <Group gap={4} mb={6}>
            <Text fw={600} size="xs">Score</Text>
            <IconChevronDown size={12} />
          </Group>
          <Text size="xs" style={{ lineHeight: 1.6 }}>
            1. Delta lead — 100<br />
            2. Alpha lead — 92<br />
            3. Epsilon lead — 84
          </Text>
        </Card>

        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed" mb={4}>Quick stats</Text>
          <SimpleGrid cols={1} spacing={4}>
            <Group justify="space-between"><Text size="xs">Total leads</Text><Badge size="xs">8</Badge></Group>
            <Group justify="space-between"><Text size="xs">Avg score</Text><Badge size="xs">69</Badge></Group>
          </SimpleGrid>
        </Paper>
      </div>
    </div>
  );
}
