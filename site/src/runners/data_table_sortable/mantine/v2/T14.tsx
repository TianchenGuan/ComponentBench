'use client';

/**
 * data_table_sortable-mantine-v2-T14: Deployments table – off-screen Last updated descending
 *
 * A compact nested_scroll panel with a Mantine DataTable wrapped in a horizontal ScrollArea.
 * Many operational columns; only part of the header row is visible. Last updated is near the
 * far right and must be revealed. A short legend and read-only summary chip group add clutter.
 *
 * Success: Last updated sorted descending (one key only).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, ScrollArea, Badge, Paper } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../../types';

type Dir = 'asc' | 'desc' | null;
interface SortState { column: string | null; direction: Dir; }

interface ThProps { children: React.ReactNode; sortable?: boolean; sorted?: boolean; reversed?: boolean; onSort?: () => void; }
function Th({ children, sortable, sorted, reversed, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  if (!sortable) return <Table.Th style={{ whiteSpace: 'nowrap' }}>{children}</Table.Th>;
  return (
    <Table.Th style={{ whiteSpace: 'nowrap' }}>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={500} size="sm">{children}</Text>
          <Center><Icon size={14} stroke={1.5} /></Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

interface DeployRow {
  id: string;
  deployId: string;
  service: string;
  version: string;
  env: string;
  status: string;
  startedAt: string;
  duration: string;
  cpu: string;
  memory: string;
  replicas: number;
  lastUpdated: string;
}

const data: DeployRow[] = [
  { id: '1', deployId: 'DEP-001', service: 'api-gateway', version: 'v2.4.1', env: 'prod', status: 'Running', startedAt: '2024-02-15 06:00', duration: '4m 12s', cpu: '45%', memory: '1.2 GB', replicas: 3, lastUpdated: '2024-02-15 08:30' },
  { id: '2', deployId: 'DEP-002', service: 'auth-svc', version: 'v1.9.0', env: 'prod', status: 'Running', startedAt: '2024-02-15 05:30', duration: '2m 45s', cpu: '22%', memory: '800 MB', replicas: 2, lastUpdated: '2024-02-15 07:15' },
  { id: '3', deployId: 'DEP-003', service: 'data-pipeline', version: 'v3.1.2', env: 'staging', status: 'Deploying', startedAt: '2024-02-15 10:00', duration: '—', cpu: '—', memory: '—', replicas: 1, lastUpdated: '2024-02-15 10:05' },
  { id: '4', deployId: 'DEP-004', service: 'web-frontend', version: 'v5.0.3', env: 'prod', status: 'Running', startedAt: '2024-02-14 22:00', duration: '3m 08s', cpu: '58%', memory: '2.1 GB', replicas: 4, lastUpdated: '2024-02-15 09:00' },
  { id: '5', deployId: 'DEP-005', service: 'notification', version: 'v1.3.7', env: 'prod', status: 'Failed', startedAt: '2024-02-15 07:45', duration: '1m 02s', cpu: '—', memory: '—', replicas: 0, lastUpdated: '2024-02-15 07:46' },
  { id: '6', deployId: 'DEP-006', service: 'search-index', version: 'v2.0.0', env: 'prod', status: 'Running', startedAt: '2024-02-14 18:00', duration: '5m 30s', cpu: '70%', memory: '3.5 GB', replicas: 2, lastUpdated: '2024-02-15 06:45' },
  { id: '7', deployId: 'DEP-007', service: 'billing-svc', version: 'v4.2.1', env: 'staging', status: 'Running', startedAt: '2024-02-15 08:00', duration: '2m 18s', cpu: '30%', memory: '600 MB', replicas: 1, lastUpdated: '2024-02-15 08:15' },
  { id: '8', deployId: 'DEP-008', service: 'ml-inference', version: 'v1.1.0', env: 'prod', status: 'Running', startedAt: '2024-02-14 20:00', duration: '8m 55s', cpu: '90%', memory: '8.0 GB', replicas: 6, lastUpdated: '2024-02-15 04:30' },
];

const statusColor = (s: string) => s === 'Running' ? 'green' : s === 'Deploying' ? 'blue' : 'red';

export default function T14({ onSuccess }: TaskComponentProps) {
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
    if (sort.column === 'lastUpdated' && sort.direction === 'desc') {
      successFired.current = true;
      onSuccess();
    }
  }, [sort, onSuccess]);

  const sortedData = React.useMemo(() => {
    if (!sort.column || !sort.direction) return data;
    return [...data].sort((a, b) => {
      const aV = a[sort.column! as keyof DeployRow];
      const bV = b[sort.column! as keyof DeployRow];
      if (typeof aV === 'string' && typeof bV === 'string') return sort.direction === 'asc' ? aV.localeCompare(bV) : bV.localeCompare(aV);
      if (typeof aV === 'number' && typeof bV === 'number') return sort.direction === 'asc' ? aV - bV : bV - aV;
      return 0;
    });
  }, [sort]);

  const sortModel: SortModel = sort.column && sort.direction
    ? [{ column_key: sort.column === 'lastUpdated' ? 'last_updated' : sort.column, direction: sort.direction, priority: 1 }]
    : [];

  return (
    <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%,-50%)', width: 700 }}>
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Group mb="xs">
          <Text fw={600} size="sm">Deployments</Text>
          <Group gap={4}>
            <Badge color="green" size="xs">Running</Badge>
            <Badge color="blue" size="xs">Deploying</Badge>
            <Badge color="red" size="xs">Failed</Badge>
          </Group>
        </Group>
        <Paper p="xs" mb="xs" withBorder>
          <Group gap="xs">
            <Badge variant="outline" size="xs">8 services</Badge>
            <Badge variant="outline" size="xs">prod: 6</Badge>
            <Badge variant="outline" size="xs">staging: 2</Badge>
          </Group>
        </Paper>
        <ScrollArea type="auto" offsetScrollbars>
          <Table highlightOnHover style={{ minWidth: 1400 }} data-testid="table-deployments" data-sort-model={JSON.stringify(sortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Deploy ID</Th>
                <Th>Service</Th>
                <Th>Version</Th>
                <Th>Env</Th>
                <Th>Status</Th>
                <Th>Started at</Th>
                <Th>Duration</Th>
                <Th>CPU</Th>
                <Th>Memory</Th>
                <Th>Replicas</Th>
                <Th sortable sorted={sort.column === 'lastUpdated'} reversed={sort.direction === 'desc'} onSort={() => toggle('lastUpdated')}>Last updated</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedData.map(r => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.deployId}</Table.Td>
                  <Table.Td>{r.service}</Table.Td>
                  <Table.Td>{r.version}</Table.Td>
                  <Table.Td>{r.env}</Table.Td>
                  <Table.Td><Badge color={statusColor(r.status)} size="sm">{r.status}</Badge></Table.Td>
                  <Table.Td>{r.startedAt}</Table.Td>
                  <Table.Td>{r.duration}</Table.Td>
                  <Table.Td>{r.cpu}</Table.Td>
                  <Table.Td>{r.memory}</Table.Td>
                  <Table.Td>{r.replicas}</Table.Td>
                  <Table.Td>{r.lastUpdated}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
