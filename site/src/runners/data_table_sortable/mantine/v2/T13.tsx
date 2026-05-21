'use client';

/**
 * data_table_sortable-mantine-v2-T13: Expense Claims card – replace stale status sort
 *
 * Two Mantine DataTable cards side by side: "Expense Claims" (pre-sorted by Status ascending)
 * and "Travel Requests" (unsorted). Dashboard panel near bottom-right. Submitted is a visible
 * date column in both cards.
 *
 * Success: Expense Claims sorted by Submitted descending (Status no longer sorted).
 *          Travel Requests remains unsorted.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, SimpleGrid, Badge } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
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

interface ClaimRow { id: string; claimId: string; employee: string; amount: number; submitted: string; status: string; }
interface TravelRow { id: string; requestId: string; traveler: string; destination: string; submitted: string; status: string; }

const claimsData: ClaimRow[] = [
  { id: '1', claimId: 'EC-201', employee: 'Alice Chen', amount: 342.50, submitted: '2024-02-10', status: 'Approved' },
  { id: '2', claimId: 'EC-202', employee: 'Bob Torres', amount: 128.00, submitted: '2024-02-14', status: 'Pending' },
  { id: '3', claimId: 'EC-203', employee: 'Carol Diaz', amount: 890.25, submitted: '2024-01-28', status: 'Rejected' },
  { id: '4', claimId: 'EC-204', employee: 'Dan Okafor', amount: 55.00, submitted: '2024-02-18', status: 'Approved' },
  { id: '5', claimId: 'EC-205', employee: 'Eva Singh', amount: 1200.00, submitted: '2024-02-05', status: 'Pending' },
  { id: '6', claimId: 'EC-206', employee: 'Frank Liu', amount: 410.75, submitted: '2024-02-22', status: 'Approved' },
  { id: '7', claimId: 'EC-207', employee: 'Grace Kim', amount: 67.50, submitted: '2024-01-30', status: 'Rejected' },
  { id: '8', claimId: 'EC-208', employee: 'Hiro Tanaka', amount: 275.00, submitted: '2024-02-12', status: 'Pending' },
];

const travelData: TravelRow[] = [
  { id: '1', requestId: 'TR-101', traveler: 'Alice Chen', destination: 'New York', submitted: '2024-02-08', status: 'Approved' },
  { id: '2', requestId: 'TR-102', traveler: 'Bob Torres', destination: 'London', submitted: '2024-02-15', status: 'Pending' },
  { id: '3', requestId: 'TR-103', traveler: 'Carol Diaz', destination: 'Tokyo', submitted: '2024-01-25', status: 'Approved' },
  { id: '4', requestId: 'TR-104', traveler: 'Dan Okafor', destination: 'Berlin', submitted: '2024-02-20', status: 'Pending' },
  { id: '5', requestId: 'TR-105', traveler: 'Eva Singh', destination: 'Paris', submitted: '2024-02-01', status: 'Rejected' },
  { id: '6', requestId: 'TR-106', traveler: 'Frank Liu', destination: 'Sydney', submitted: '2024-02-17', status: 'Approved' },
];

const statusBadge = (s: string) => s === 'Approved' ? 'green' : s === 'Pending' ? 'yellow' : 'red';

export default function T13({ onSuccess }: TaskComponentProps) {
  const [claimSort, setClaimSort] = useState<SortState>({ column: 'status', direction: 'asc' });
  const [travelSort, setTravelSort] = useState<SortState>({ column: null, direction: null });
  const successFired = useRef(false);

  const toggleClaim = useCallback((col: string) => {
    setClaimSort(prev => {
      if (prev.column === col) {
        if (prev.direction === 'asc') return { column: col, direction: 'desc' };
        if (prev.direction === 'desc') return { column: null, direction: null };
        return { column: col, direction: 'asc' };
      }
      return { column: col, direction: 'asc' };
    });
  }, []);

  const toggleTravel = useCallback((col: string) => {
    setTravelSort(prev => {
      if (prev.column === col) {
        if (prev.direction === 'asc') return { column: col, direction: 'desc' };
        if (prev.direction === 'desc') return { column: null, direction: null };
        return { column: col, direction: 'asc' };
      }
      return { column: col, direction: 'asc' };
    });
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const claimOk = claimSort.column === 'submitted' && claimSort.direction === 'desc';
    const travelOk = !travelSort.column;
    if (claimOk && travelOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [claimSort, travelSort, onSuccess]);

  const sortRows = <T extends Record<string, unknown>>(rows: T[], s: SortState): T[] => {
    if (!s.column || !s.direction) return rows;
    return [...rows].sort((a, b) => {
      const aV = a[s.column!]; const bV = b[s.column!];
      if (typeof aV === 'number' && typeof bV === 'number') return s.direction === 'asc' ? aV - bV : bV - aV;
      if (typeof aV === 'string' && typeof bV === 'string') return s.direction === 'asc' ? aV.localeCompare(bV) : bV.localeCompare(aV);
      return 0;
    });
  };

  const claimModel: SortModel = claimSort.column && claimSort.direction
    ? [{ column_key: claimSort.column, direction: claimSort.direction, priority: 1 }] : [];
  const travelModel: SortModel = travelSort.column && travelSort.direction
    ? [{ column_key: travelSort.column, direction: travelSort.direction, priority: 1 }] : [];

  return (
    <div style={{ position: 'absolute', bottom: 24, right: 24, width: 860 }}>
      <SimpleGrid cols={2}>
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Text fw={600} size="sm" mb="xs">Expense Claims</Text>
          <Table highlightOnHover data-testid="table-expense-claims" data-sort-model={JSON.stringify(claimModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Claim ID</Th>
                <Th>Employee</Th>
                <Th sortable sorted={claimSort.column === 'submitted'} reversed={claimSort.direction === 'desc'} onSort={() => toggleClaim('submitted')}>Submitted</Th>
                <Th sortable sorted={claimSort.column === 'status'} reversed={claimSort.direction === 'desc'} onSort={() => toggleClaim('status')}>Status</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(sortRows(claimsData as any, claimSort) as unknown as ClaimRow[]).map(r => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.claimId}</Table.Td>
                  <Table.Td>{r.employee}</Table.Td>
                  <Table.Td>{r.submitted}</Table.Td>
                  <Table.Td><Badge color={statusBadge(r.status)} size="sm">{r.status}</Badge></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Text fw={600} size="sm" mb="xs">Travel Requests</Text>
          <Table highlightOnHover data-testid="table-travel-requests" data-sort-model={JSON.stringify(travelModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Request ID</Th>
                <Th>Traveler</Th>
                <Th sortable sorted={travelSort.column === 'submitted'} reversed={travelSort.direction === 'desc'} onSort={() => toggleTravel('submitted')}>Submitted</Th>
                <Th sortable sorted={travelSort.column === 'status'} reversed={travelSort.direction === 'desc'} onSort={() => toggleTravel('status')}>Status</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(sortRows(travelData as any, travelSort) as unknown as TravelRow[]).map(r => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.requestId}</Table.Td>
                  <Table.Td>{r.traveler}</Table.Td>
                  <Table.Td>{r.submitted}</Table.Td>
                  <Table.Td><Badge color={statusBadge(r.status)} size="sm">{r.status}</Badge></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </SimpleGrid>
    </div>
  );
}
