'use client';

/**
 * data_table_sortable-mantine-T28: Modal - open Manage Sessions and sort Last activity newest→oldest
 *
 * Modal flow scene where the sortable table is only available in a modal.
 * - Main page has "Manage Sessions" button.
 * - Modal contains a small-scale table listing active sessions.
 * - Columns: Device, Location, Last activity, Status.
 * - Initial state: unsorted.
 *
 * Distractors: Close button in modal.
 * Success: Modal open AND Last activity sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, Modal, Button, Badge } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector, IconDevices } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface SessionData {
  id: string;
  device: string;
  location: string;
  lastActivity: string;
  status: 'Active' | 'Idle';
}

const sessionsData: SessionData[] = [
  { id: '1', device: 'MacBook Pro', location: 'San Francisco, CA', lastActivity: '2024-02-15 09:30', status: 'Active' },
  { id: '2', device: 'iPhone 15', location: 'San Francisco, CA', lastActivity: '2024-02-15 08:45', status: 'Active' },
  { id: '3', device: 'Windows PC', location: 'New York, NY', lastActivity: '2024-02-14 17:30', status: 'Idle' },
  { id: '4', device: 'iPad Pro', location: 'Chicago, IL', lastActivity: '2024-02-15 10:15', status: 'Active' },
  { id: '5', device: 'Chrome Browser', location: 'Austin, TX', lastActivity: '2024-02-13 14:20', status: 'Idle' },
  { id: '6', device: 'Android Phone', location: 'Seattle, WA', lastActivity: '2024-02-15 07:55', status: 'Active' },
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
    return <Table.Th style={{ fontSize: 11, padding: '6px 8px' }}>{children}</Table.Th>;
  }

  return (
    <Table.Th style={{ fontSize: 11, padding: '6px 8px' }}>
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

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
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
    if (!sortBy || !sortDirection) return sessionsData;
    return [...sessionsData].sort((a, b) => {
      if (sortBy === 'lastActivity') {
        return sortDirection === 'asc'
          ? new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()
          : new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      }
      return 0;
    });
  }, [sortBy, sortDirection]);

  // Check success condition: modal open AND sorted
  useEffect(() => {
    if (modalOpen && sortBy === 'lastActivity' && sortDirection === 'desc') {
      onSuccess();
    }
  }, [modalOpen, sortBy, sortDirection, onSuccess]);

  const sortModel: SortModel = sortBy && sortDirection
    ? [{ column_key: sortBy === 'lastActivity' ? 'last_activity' : sortBy, direction: sortDirection, priority: 1 }]
    : [];

  return (
    <div style={{ width: 400 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={500} size="md" mb="md">Account Settings</Text>
        <Button
          leftSection={<IconDevices size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Manage Sessions
        </Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Manage Sessions"
        size="lg"
        data-overlay-type="modal"
        data-overlay-label="Manage Sessions"
      >
        <Table
          highlightOnHover
          data-testid="table-sessions"
          data-sort-model={JSON.stringify(sortModel)}
        >
          <Table.Thead>
            <Table.Tr>
              <Th>Device</Th>
              <Th>Location</Th>
              <Th
                sortable
                sorted={sortBy === 'lastActivity'}
                reversed={sortDirection === 'desc'}
                onSort={() => handleSort('lastActivity')}
              >
                Last activity
              </Th>
              <Th>Status</Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td style={{ fontSize: 12, padding: '4px 8px' }}>{row.device}</Table.Td>
                <Table.Td style={{ fontSize: 12, padding: '4px 8px' }}>{row.location}</Table.Td>
                <Table.Td style={{ fontSize: 12, padding: '4px 8px' }}>{row.lastActivity}</Table.Td>
                <Table.Td style={{ fontSize: 12, padding: '4px 8px' }}>
                  <Badge color={row.status === 'Active' ? 'green' : 'gray'} size="sm">
                    {row.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setModalOpen(false)}>Close</Button>
        </Group>
      </Modal>
    </div>
  );
}
