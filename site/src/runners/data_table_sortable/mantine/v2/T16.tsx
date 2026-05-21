'use client';

/**
 * data_table_sortable-mantine-v2-T16: Manage Sessions modal – sort Last activity newest first
 *
 * A centered modal opens over a settings page when "Manage Sessions" is clicked. Inside is
 * one Mantine DataTable titled "Sessions". Last activity is sortable; Location and Device
 * are also visible. The modal header includes Close and a help icon, no extra apply button.
 * Dark theme.
 *
 * Success: Last activity sorted descending (one key only).
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Table, Card, Text, UnstyledButton, Group, Center, Button, Modal, Badge,
  ActionIcon, MantineProvider,
} from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector, IconHelp, IconSettings } from '@tabler/icons-react';
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

interface SessionRow {
  id: string;
  sessionId: string;
  device: string;
  location: string;
  browser: string;
  lastActivity: string;
  status: string;
}

const sessionsData: SessionRow[] = [
  { id: '1', sessionId: 'SES-001', device: 'MacBook Pro', location: 'San Francisco, US', browser: 'Chrome 121', lastActivity: '2024-02-15 14:30', status: 'Active' },
  { id: '2', sessionId: 'SES-002', device: 'iPhone 15', location: 'San Francisco, US', browser: 'Safari 17', lastActivity: '2024-02-15 12:00', status: 'Active' },
  { id: '3', sessionId: 'SES-003', device: 'Windows PC', location: 'New York, US', browser: 'Firefox 122', lastActivity: '2024-02-14 09:45', status: 'Idle' },
  { id: '4', sessionId: 'SES-004', device: 'iPad Air', location: 'London, UK', browser: 'Safari 17', lastActivity: '2024-02-13 18:20', status: 'Expired' },
  { id: '5', sessionId: 'SES-005', device: 'Linux Desktop', location: 'Berlin, DE', browser: 'Chrome 121', lastActivity: '2024-02-15 08:15', status: 'Active' },
  { id: '6', sessionId: 'SES-006', device: 'Android Phone', location: 'Tokyo, JP', browser: 'Chrome 121', lastActivity: '2024-02-12 22:00', status: 'Expired' },
  { id: '7', sessionId: 'SES-007', device: 'MacBook Air', location: 'Paris, FR', browser: 'Safari 17', lastActivity: '2024-02-14 16:30', status: 'Idle' },
  { id: '8', sessionId: 'SES-008', device: 'Windows Laptop', location: 'Toronto, CA', browser: 'Edge 121', lastActivity: '2024-02-15 10:00', status: 'Active' },
];

const statusColor = (s: string) => s === 'Active' ? 'green' : s === 'Idle' ? 'yellow' : 'gray';

export default function T16({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
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
    if (sort.column === 'lastActivity' && sort.direction === 'desc') {
      successFired.current = true;
      onSuccess();
    }
  }, [sort, onSuccess]);

  const sortedData = React.useMemo(() => {
    if (!sort.column || !sort.direction) return sessionsData;
    return [...sessionsData].sort((a, b) => {
      const aV = a[sort.column! as keyof SessionRow] as string;
      const bV = b[sort.column! as keyof SessionRow] as string;
      return sort.direction === 'asc' ? aV.localeCompare(bV) : bV.localeCompare(aV);
    });
  }, [sort]);

  const sortModel: SortModel = sort.column && sort.direction
    ? [{ column_key: sort.column === 'lastActivity' ? 'last_activity' : sort.column, direction: sort.direction, priority: 1 }]
    : [];

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 24 }}>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400 }}>
          <Group>
            <IconSettings size={18} />
            <Text fw={500}>Account Settings</Text>
          </Group>
          <Button mt="md" variant="outline" onClick={() => setOpened(true)}>Manage Sessions</Button>
        </Card>

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title={
            <Group gap="xs">
              <Text fw={600}>Sessions</Text>
              <ActionIcon variant="subtle" size="sm"><IconHelp size={14} /></ActionIcon>
            </Group>
          }
          size="lg"
          centered
        >
          <Table highlightOnHover data-testid="table-sessions" data-sort-model={JSON.stringify(sortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Session</Th>
                <Th>Device</Th>
                <Th>Location</Th>
                <Th>Browser</Th>
                <Th sortable sorted={sort.column === 'lastActivity'} reversed={sort.direction === 'desc'} onSort={() => toggle('lastActivity')}>Last activity</Th>
                <Th>Status</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedData.map(r => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.sessionId}</Table.Td>
                  <Table.Td>{r.device}</Table.Td>
                  <Table.Td>{r.location}</Table.Td>
                  <Table.Td>{r.browser}</Table.Td>
                  <Table.Td>{r.lastActivity}</Table.Td>
                  <Table.Td><Badge color={statusColor(r.status)} size="sm">{r.status}</Badge></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Modal>
      </div>
    </MantineProvider>
  );
}
