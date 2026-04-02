'use client';

/**
 * data_table_sortable-mantine-T25: Compact wide table - scroll to Last updated and sort newest→oldest
 *
 * A single Mantine composite sortable table wrapped in horizontal ScrollArea.
 * - Spacing: compact, scale: small.
 * - Many columns; Last updated is near the far right and requires scrolling.
 * - Initial state: unsorted.
 *
 * Success: Last updated sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, ScrollArea } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface DeploymentData {
  id: string;
  deployment: string;
  service: string;
  region: string;
  version: string;
  owner: string;
  status: string;
  lastUpdated: string;
  notes: string;
}

const deploymentsData: DeploymentData[] = [
  { id: '1', deployment: 'prod-v2.5', service: 'API', region: 'us-east-1', version: '2.5.1', owner: 'Alice', status: 'Active', lastUpdated: '2024-02-15 09:30', notes: 'Stable' },
  { id: '2', deployment: 'stag-v2.5', service: 'API', region: 'us-west-2', version: '2.5.0', owner: 'Bob', status: 'Active', lastUpdated: '2024-02-14 14:20', notes: 'Testing' },
  { id: '3', deployment: 'prod-v2.4', service: 'Worker', region: 'eu-west-1', version: '2.4.9', owner: 'Carol', status: 'Deprecated', lastUpdated: '2024-02-10 11:00', notes: 'Migrating' },
  { id: '4', deployment: 'dev-v2.6', service: 'API', region: 'us-east-1', version: '2.6.0-rc', owner: 'David', status: 'Active', lastUpdated: '2024-02-15 16:45', notes: 'RC' },
  { id: '5', deployment: 'prod-v2.4', service: 'Scheduler', region: 'ap-south-1', version: '2.4.8', owner: 'Emma', status: 'Active', lastUpdated: '2024-02-12 08:15', notes: 'Stable' },
  { id: '6', deployment: 'stag-v2.6', service: 'Worker', region: 'us-west-2', version: '2.6.0-beta', owner: 'Frank', status: 'Active', lastUpdated: '2024-02-13 10:30', notes: 'Beta' },
  { id: '7', deployment: 'prod-v2.3', service: 'API', region: 'eu-central-1', version: '2.3.7', owner: 'Grace', status: 'Deprecated', lastUpdated: '2024-02-05 17:00', notes: 'EOL' },
  { id: '8', deployment: 'dev-v2.7', service: 'Scheduler', region: 'us-east-1', version: '2.7.0-alpha', owner: 'Henry', status: 'Active', lastUpdated: '2024-02-15 18:00', notes: 'Alpha' },
];

type SortDirection = 'asc' | 'desc' | null;

interface ThProps {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: boolean;
  reversed?: boolean;
  onSort?: () => void;
  width?: number;
}

function Th({ children, sortable, sorted, reversed, onSort, width }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  
  if (!sortable) {
    return <Table.Th style={{ minWidth: width, fontSize: 11, padding: '4px 8px' }}>{children}</Table.Th>;
  }

  return (
    <Table.Th style={{ minWidth: width, fontSize: 11, padding: '4px 8px' }}>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap" gap={4}>
          <Text fw={500} size="xs">{children}</Text>
          <Center>
            <Icon size={12} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortBy(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy || !sortDirection) return deploymentsData;
    return [...deploymentsData].sort((a, b) => {
      if (sortBy === 'lastUpdated') {
        return sortDirection === 'asc'
          ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      return 0;
    });
  }, [sortBy, sortDirection]);

  // Check success condition
  useEffect(() => {
    if (sortBy === 'lastUpdated' && sortDirection === 'desc') {
      onSuccess();
    }
  }, [sortBy, sortDirection, onSuccess]);

  const sortModel: SortModel = sortBy && sortDirection
    ? [{ column_key: sortBy === 'lastUpdated' ? 'last_updated' : sortBy, direction: sortDirection, priority: 1 }]
    : [];

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="sm" mb="sm">Deployments</Text>
      <ScrollArea>
        <Table
          highlightOnHover
          data-testid="table-deployments"
          data-sort-model={JSON.stringify(sortModel)}
          style={{ minWidth: 900 }}
        >
          <Table.Thead>
            <Table.Tr>
              <Th width={90}>Deployment</Th>
              <Th width={70}>Service</Th>
              <Th width={90}>Region</Th>
              <Th width={80}>Version</Th>
              <Th width={70}>Owner</Th>
              <Th width={80}>Status</Th>
              <Th
                sortable
                sorted={sortBy === 'lastUpdated'}
                reversed={sortDirection === 'desc'}
                onSort={() => handleSort('lastUpdated')}
                width={120}
              >
                Last updated
              </Th>
              <Th width={80}>Notes</Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.deployment}</Table.Td>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.service}</Table.Td>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.region}</Table.Td>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.version}</Table.Td>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.owner}</Table.Td>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.status}</Table.Td>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.lastUpdated}</Table.Td>
                <Table.Td style={{ fontSize: 11, padding: '2px 8px' }}>{row.notes}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
