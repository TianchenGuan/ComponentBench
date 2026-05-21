'use client';

/**
 * data_table_sortable-mantine-T22: Customers - sort Name Z→A (toggle)
 *
 * Single Mantine composite sortable table titled "Customers".
 * - Columns: Name, City, Segment, Joined.
 * - Name header toggles sorting state (unsorted → asc → desc).
 * - Initial state: unsorted.
 *
 * Distractors: "Invite customer" button.
 * Success: Name sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, Button } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector, IconUserPlus } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface CustomerData {
  id: string;
  name: string;
  city: string;
  segment: string;
  joined: string;
}

const customersData: CustomerData[] = [
  { id: '1', name: 'Alice Thompson', city: 'Boston', segment: 'Enterprise', joined: '2023-06-15' },
  { id: '2', name: 'Bob Martinez', city: 'Chicago', segment: 'SMB', joined: '2023-08-22' },
  { id: '3', name: 'Carol White', city: 'Denver', segment: 'Enterprise', joined: '2023-04-10' },
  { id: '4', name: 'Daniel Kim', city: 'Seattle', segment: 'Startup', joined: '2023-11-05' },
  { id: '5', name: 'Emma Davis', city: 'Austin', segment: 'SMB', joined: '2023-07-30' },
  { id: '6', name: 'Frank Wilson', city: 'Portland', segment: 'Enterprise', joined: '2023-03-18' },
  { id: '7', name: 'Grace Lee', city: 'Miami', segment: 'Startup', joined: '2023-09-12' },
  { id: '8', name: 'Henry Brown', city: 'Atlanta', segment: 'SMB', joined: '2023-05-25' },
  { id: '9', name: 'Iris Johnson', city: 'Phoenix', segment: 'Enterprise', joined: '2023-10-08' },
  { id: '10', name: 'Jack Smith', city: 'Dallas', segment: 'Startup', joined: '2023-02-14' },
];

type SortDirection = 'asc' | 'desc' | null;

interface ThProps {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: boolean;
  reversed?: boolean;
  onSort?: () => void;
}

function Th({ children, sortable, sorted, reversed, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  
  if (!sortable) {
    return <Table.Th>{children}</Table.Th>;
  }

  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }} aria-label={`Sort by ${children}`}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={500} size="sm">{children}</Text>
          <Center>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
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
    if (!sortBy || !sortDirection) return customersData;
    return [...customersData].sort((a, b) => {
      const aVal = a[sortBy as keyof CustomerData];
      const bVal = b[sortBy as keyof CustomerData];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [sortBy, sortDirection]);

  // Check success condition
  useEffect(() => {
    if (sortBy === 'name' && sortDirection === 'desc') {
      onSuccess();
    }
  }, [sortBy, sortDirection, onSuccess]);

  const sortModel: SortModel = sortBy && sortDirection
    ? [{ column_key: sortBy, direction: sortDirection, priority: 1 }]
    : [];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 650 }}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="md">Customers</Text>
        <Button leftSection={<IconUserPlus size={16} />} disabled variant="light">
          Invite customer
        </Button>
      </Group>
      <Table
        highlightOnHover
        data-testid="table-customers"
        data-sort-model={JSON.stringify(sortModel)}
      >
        <Table.Thead>
          <Table.Tr>
            <Th
              sortable
              sorted={sortBy === 'name'}
              reversed={sortDirection === 'desc'}
              onSort={() => handleSort('name')}
            >
              Name
            </Th>
            <Th>City</Th>
            <Th>Segment</Th>
            <Th
              sortable
              sorted={sortBy === 'joined'}
              reversed={sortDirection === 'desc'}
              onSort={() => handleSort('joined')}
            >
              Joined
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.city}</Table.Td>
              <Table.Td>{row.segment}</Table.Td>
              <Table.Td>{row.joined}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
