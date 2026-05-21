'use client';

/**
 * data_table_sortable-mantine-T26: Leads - match reference preview order (visual)
 *
 * Single Mantine composite sortable table titled "Leads" with visual reference preview.
 * - Reference preview shows "Score" with downward arrow and 3-row sample.
 * - Columns: Lead, Company, Score, Last contact.
 * - Initial state: unsorted.
 *
 * Distractors: search input.
 * Success: Score sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, Paper, TextInput, Box } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector, IconArrowDown, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface LeadData {
  id: string;
  lead: string;
  company: string;
  score: number;
  lastContact: string;
}

const leadsData: LeadData[] = [
  { id: '1', lead: 'Alice Johnson', company: 'Acme Corp', score: 85, lastContact: '2024-02-14' },
  { id: '2', lead: 'Bob Williams', company: 'TechStart', score: 72, lastContact: '2024-02-10' },
  { id: '3', lead: 'Carol Brown', company: 'Global Systems', score: 91, lastContact: '2024-02-15' },
  { id: '4', lead: 'David Miller', company: 'DataFlow', score: 68, lastContact: '2024-02-12' },
  { id: '5', lead: 'Emma Davis', company: 'CloudNet', score: 88, lastContact: '2024-02-13' },
  { id: '6', lead: 'Frank Wilson', company: 'Innovate Labs', score: 65, lastContact: '2024-02-08' },
  { id: '7', lead: 'Grace Taylor', company: 'QuickShip', score: 79, lastContact: '2024-02-11' },
  { id: '8', lead: 'Henry Anderson', company: 'FinanceHub', score: 94, lastContact: '2024-02-15' },
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
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
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

export default function T06({ onSuccess }: TaskComponentProps) {
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
    if (!sortBy || !sortDirection) return leadsData;
    return [...leadsData].sort((a, b) => {
      if (sortBy === 'score') {
        return sortDirection === 'asc' ? a.score - b.score : b.score - a.score;
      }
      return 0;
    });
  }, [sortBy, sortDirection]);

  // Check success condition
  useEffect(() => {
    if (sortBy === 'score' && sortDirection === 'desc') {
      onSuccess();
    }
  }, [sortBy, sortDirection, onSuccess]);

  const sortModel: SortModel = sortBy && sortDirection
    ? [{ column_key: sortBy, direction: sortDirection, priority: 1 }]
    : [];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Group justify="space-between" align="flex-start" mb="md">
        <Box style={{ flex: 1 }}>
          <Text fw={500} size="md" mb="sm">Leads</Text>
          <TextInput
            placeholder="Search leads..."
            leftSection={<IconSearch size={16} />}
            style={{ maxWidth: 250 }}
            disabled
          />
        </Box>
        
        {/* Reference preview */}
        <Paper
          withBorder
          p="sm"
          style={{ backgroundColor: '#f8f9fa' }}
          data-ref-sort="score:desc"
        >
          <Text size="xs" c="dimmed" mb="xs">Reference preview</Text>
          <Group gap={4} mb="xs" style={{ padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
            <Text size="sm" fw={500}>Score</Text>
            <IconArrowDown size={14} />
          </Group>
          <Box style={{ fontSize: 10, color: '#666' }}>
            <div>Henry (94)</div>
            <div>Carol (91)</div>
            <div>Emma (88)</div>
          </Box>
        </Paper>
      </Group>

      <Table
        highlightOnHover
        data-testid="table-leads"
        data-sort-model={JSON.stringify(sortModel)}
      >
        <Table.Thead>
          <Table.Tr>
            <Th>Lead</Th>
            <Th>Company</Th>
            <Th
              sortable
              sorted={sortBy === 'score'}
              reversed={sortDirection === 'desc'}
              onSort={() => handleSort('score')}
            >
              Score
            </Th>
            <Th
              sortable
              sorted={sortBy === 'lastContact'}
              reversed={sortDirection === 'desc'}
              onSort={() => handleSort('lastContact')}
            >
              Last contact
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.lead}</Table.Td>
              <Table.Td>{row.company}</Table.Td>
              <Table.Td>{row.score}</Table.Td>
              <Table.Td>{row.lastContact}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
