'use client';

/**
 * data_table_sortable-mantine-v2-T12: Pipelines dashboard – high-clutter three-table disambiguation
 *
 * A dark, high-clutter dashboard_panel shows three Mantine DataTable cards titled "Pipelines",
 * "Deals", and "Accounts". Each card has a percentage-like sortable column with small chevrons.
 * A KPI strip and navigation bar above add clutter.
 *
 * Success: Pipelines sorted by Win probability descending. Deals and Accounts remain unsorted.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, MantineProvider, SimpleGrid, Badge, Paper } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../../types';

type Dir = 'asc' | 'desc' | null;
interface SortState { column: string | null; direction: Dir; }

interface ThProps {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: boolean;
  reversed?: boolean;
  onSort?: () => void;
}

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

function useSortTable() {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const toggle = useCallback((col: string) => {
    setSort(prev => {
      if (prev.column === col) {
        if (prev.direction === 'asc') return { column: col, direction: 'desc' };
        if (prev.direction === 'desc') return { column: null, direction: null };
        return { column: col, direction: 'asc' };
      }
      return { column: col, direction: 'asc' };
    });
  }, []);
  return { sort, toggle };
}

interface PipelineRow { id: string; name: string; stage: string; winProbability: number; value: number; }
interface DealRow { id: string; name: string; closeRate: number; amount: number; }
interface AccountRow { id: string; name: string; retention: number; arr: number; }

const pipelineData: PipelineRow[] = [
  { id: '1', name: 'Acme deal', stage: 'Proposal', winProbability: 92, value: 48000 },
  { id: '2', name: 'TechStart', stage: 'Discovery', winProbability: 55, value: 12000 },
  { id: '3', name: 'GlobalSys', stage: 'Negotiation', winProbability: 78, value: 95000 },
  { id: '4', name: 'DataFlow', stage: 'Closed', winProbability: 100, value: 23000 },
  { id: '5', name: 'CloudNet', stage: 'Proposal', winProbability: 84, value: 67000 },
  { id: '6', name: 'InnoLabs', stage: 'Discovery', winProbability: 30, value: 8000 },
  { id: '7', name: 'QuickShip', stage: 'Negotiation', winProbability: 67, value: 15000 },
];

const dealData: DealRow[] = [
  { id: '1', name: 'Enterprise pkg', closeRate: 72, amount: 120000 },
  { id: '2', name: 'Starter bundle', closeRate: 45, amount: 5000 },
  { id: '3', name: 'Pro upgrade', closeRate: 88, amount: 35000 },
  { id: '4', name: 'Support add-on', closeRate: 60, amount: 8000 },
  { id: '5', name: 'Migration svc', closeRate: 33, amount: 15000 },
];

const accountData: AccountRow[] = [
  { id: '1', name: 'Acme Corp', retention: 95, arr: 48000 },
  { id: '2', name: 'TechStart', retention: 78, arr: 9600 },
  { id: '3', name: 'GlobalSys', retention: 62, arr: 100000 },
  { id: '4', name: 'DataFlow', retention: 90, arr: 2400 },
  { id: '5', name: 'CloudNet', retention: 85, arr: 17600 },
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const pip = useSortTable();
  const deal = useSortTable();
  const acc = useSortTable();
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const pipOk = pip.sort.column === 'winProbability' && pip.sort.direction === 'desc';
    const dealOk = !deal.sort.column;
    const accOk = !acc.sort.column;
    if (pipOk && dealOk && accOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [pip.sort, deal.sort, acc.sort, onSuccess]);

  const toModel = (s: SortState, keyMap?: Record<string, string>): SortModel =>
    s.column && s.direction
      ? [{ column_key: (keyMap?.[s.column] || s.column), direction: s.direction, priority: 1 }]
      : [];

  const pipModel = toModel(pip.sort, { winProbability: 'win_probability' });
  const dealModel = toModel(deal.sort, { closeRate: 'close_rate' });
  const accModel = toModel(acc.sort);

  const sortRows = <T extends Record<string, unknown>>(rows: T[], s: SortState): T[] => {
    if (!s.column || !s.direction) return rows;
    return [...rows].sort((a, b) => {
      const aV = a[s.column!]; const bV = b[s.column!];
      if (typeof aV === 'number' && typeof bV === 'number') return s.direction === 'asc' ? aV - bV : bV - aV;
      return 0;
    });
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ position: 'absolute', top: 24, left: 24, width: 920, background: '#1a1b1e', padding: 16, borderRadius: 8 }}>
        <Group mb="sm">
          <Badge color="blue">CRM Dashboard</Badge>
          <Badge variant="outline">Q1 2024</Badge>
        </Group>
        <SimpleGrid cols={4} mb="md">
          <Paper p="xs" withBorder><Text size="xs" c="dimmed">Pipeline value</Text><Text fw={700}>$268k</Text></Paper>
          <Paper p="xs" withBorder><Text size="xs" c="dimmed">Avg win rate</Text><Text fw={700}>72%</Text></Paper>
          <Paper p="xs" withBorder><Text size="xs" c="dimmed">Open deals</Text><Text fw={700}>14</Text></Paper>
          <Paper p="xs" withBorder><Text size="xs" c="dimmed">Total ARR</Text><Text fw={700}>$177k</Text></Paper>
        </SimpleGrid>

        <SimpleGrid cols={3}>
          <Card shadow="sm" padding="sm" radius="md" withBorder>
            <Text fw={600} size="sm" mb="xs">Pipelines</Text>
            <Table highlightOnHover data-testid="table-pipelines" data-sort-model={JSON.stringify(pipModel)}>
              <Table.Thead>
                <Table.Tr>
                  <Th>Name</Th>
                  <Th>Stage</Th>
                  <Th sortable sorted={pip.sort.column === 'winProbability'} reversed={pip.sort.direction === 'desc'} onSort={() => pip.toggle('winProbability')}>Win probability</Th>
                  <Th sortable sorted={pip.sort.column === 'value'} reversed={pip.sort.direction === 'desc'} onSort={() => pip.toggle('value')}>Value</Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {(sortRows(pipelineData as any, pip.sort) as unknown as PipelineRow[]).map(r => (
                  <Table.Tr key={r.id}><Table.Td>{r.name}</Table.Td><Table.Td>{r.stage}</Table.Td><Table.Td>{r.winProbability}%</Table.Td><Table.Td>${r.value.toLocaleString()}</Table.Td></Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>

          <Card shadow="sm" padding="sm" radius="md" withBorder>
            <Text fw={600} size="sm" mb="xs">Deals</Text>
            <Table highlightOnHover data-testid="table-deals" data-sort-model={JSON.stringify(dealModel)}>
              <Table.Thead>
                <Table.Tr>
                  <Th>Name</Th>
                  <Th sortable sorted={deal.sort.column === 'closeRate'} reversed={deal.sort.direction === 'desc'} onSort={() => deal.toggle('closeRate')}>Close rate</Th>
                  <Th sortable sorted={deal.sort.column === 'amount'} reversed={deal.sort.direction === 'desc'} onSort={() => deal.toggle('amount')}>Amount</Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {(sortRows(dealData as any, deal.sort) as unknown as DealRow[]).map(r => (
                  <Table.Tr key={r.id}><Table.Td>{r.name}</Table.Td><Table.Td>{r.closeRate}%</Table.Td><Table.Td>${r.amount.toLocaleString()}</Table.Td></Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>

          <Card shadow="sm" padding="sm" radius="md" withBorder>
            <Text fw={600} size="sm" mb="xs">Accounts</Text>
            <Table highlightOnHover data-testid="table-accounts" data-sort-model={JSON.stringify(accModel)}>
              <Table.Thead>
                <Table.Tr>
                  <Th>Name</Th>
                  <Th sortable sorted={acc.sort.column === 'retention'} reversed={acc.sort.direction === 'desc'} onSort={() => acc.toggle('retention')}>Retention</Th>
                  <Th sortable sorted={acc.sort.column === 'arr'} reversed={acc.sort.direction === 'desc'} onSort={() => acc.toggle('arr')}>ARR</Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {(sortRows(accountData as any, acc.sort) as unknown as AccountRow[]).map(r => (
                  <Table.Tr key={r.id}><Table.Td>{r.name}</Table.Td><Table.Td>{r.retention}%</Table.Td><Table.Td>${r.arr.toLocaleString()}</Table.Td></Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </SimpleGrid>
      </div>
    </MantineProvider>
  );
}
