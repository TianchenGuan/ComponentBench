'use client';

/**
 * data_table_sortable-mantine-T29: Dashboard - sort Expense Claims by Submitted newest→oldest (two tables, bottom-right)
 *
 * Medium-clutter dashboard with two similar Mantine composite sortable tables.
 * - "Expense Claims" (target) and "Travel Requests" (distractor).
 * - Initial state: Expense Claims is pre-sorted by Status ascending.
 * - Task: switch sort to Submitted descending.
 * - Placement: bottom_right.
 *
 * Success: Expense Claims Submitted sorted descending; Travel Requests unchanged.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, Badge, Stack } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface ExpenseClaimData {
  id: string;
  claimId: string;
  amount: number;
  submitted: string;
  status: string;
}

interface TravelRequestData {
  id: string;
  requestId: string;
  destination: string;
  requestDate: string;
  status: string;
}

const expenseClaimsData: ExpenseClaimData[] = [
  { id: '1', claimId: 'EXP-101', amount: 245.00, submitted: '2024-02-15', status: 'Approved' },
  { id: '2', claimId: 'EXP-102', amount: 89.50, submitted: '2024-02-10', status: 'Pending' },
  { id: '3', claimId: 'EXP-103', amount: 532.00, submitted: '2024-02-14', status: 'Approved' },
  { id: '4', claimId: 'EXP-104', amount: 178.25, submitted: '2024-02-12', status: 'Rejected' },
  { id: '5', claimId: 'EXP-105', amount: 420.00, submitted: '2024-02-13', status: 'Pending' },
];

const travelRequestsData: TravelRequestData[] = [
  { id: '1', requestId: 'TRV-201', destination: 'New York', requestDate: '2024-02-08', status: 'Approved' },
  { id: '2', requestId: 'TRV-202', destination: 'London', requestDate: '2024-02-11', status: 'Pending' },
  { id: '3', requestId: 'TRV-203', destination: 'Tokyo', requestDate: '2024-02-05', status: 'Approved' },
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
    return <Table.Th style={{ fontSize: 12 }}>{children}</Table.Th>;
  }

  return (
    <Table.Th style={{ fontSize: 12 }}>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap" gap={4}>
          <Text fw={500} size="xs">{children}</Text>
          <Center>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  // Start with status sorted ascending
  const [expensesSortBy, setExpensesSortBy] = useState<string>('status');
  const [expensesSortDirection, setExpensesSortDirection] = useState<SortDirection>('asc');
  const [travelSortBy, setTravelSortBy] = useState<string | null>(null);
  const [travelSortDirection, setTravelSortDirection] = useState<SortDirection>(null);

  const handleExpensesSort = (column: string) => {
    // Single-sort mode: switching column clears previous
    if (expensesSortBy === column) {
      if (expensesSortDirection === 'asc') {
        setExpensesSortDirection('desc');
      } else if (expensesSortDirection === 'desc') {
        setExpensesSortDirection(null);
        setExpensesSortBy('');
      } else {
        setExpensesSortDirection('asc');
      }
    } else {
      setExpensesSortBy(column);
      setExpensesSortDirection('asc');
    }
  };

  const handleTravelSort = (column: string) => {
    if (travelSortBy === column) {
      if (travelSortDirection === 'asc') {
        setTravelSortDirection('desc');
      } else if (travelSortDirection === 'desc') {
        setTravelSortDirection(null);
        setTravelSortBy(null);
      } else {
        setTravelSortDirection('asc');
      }
    } else {
      setTravelSortBy(column);
      setTravelSortDirection('asc');
    }
  };

  const sortedExpenses = React.useMemo(() => {
    if (!expensesSortBy || !expensesSortDirection) return expenseClaimsData;
    return [...expenseClaimsData].sort((a, b) => {
      if (expensesSortBy === 'submitted') {
        return expensesSortDirection === 'asc'
          ? new Date(a.submitted).getTime() - new Date(b.submitted).getTime()
          : new Date(b.submitted).getTime() - new Date(a.submitted).getTime();
      }
      if (expensesSortBy === 'status') {
        return expensesSortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  }, [expensesSortBy, expensesSortDirection]);

  // Check success condition
  useEffect(() => {
    const expensesCorrect = expensesSortBy === 'submitted' && expensesSortDirection === 'desc';
    const travelUntouched = !travelSortBy || !travelSortDirection;
    if (expensesCorrect && travelUntouched) {
      onSuccess();
    }
  }, [expensesSortBy, expensesSortDirection, travelSortBy, travelSortDirection, onSuccess]);

  const expensesSortModel: SortModel = expensesSortBy && expensesSortDirection
    ? [{ column_key: expensesSortBy, direction: expensesSortDirection, priority: 1 }]
    : [];

  const travelSortModel: SortModel = travelSortBy && travelSortDirection
    ? [{ column_key: travelSortBy === 'requestDate' ? 'request_date' : travelSortBy, direction: travelSortDirection, priority: 1 }]
    : [];

  return (
    <Stack style={{ width: 750 }} gap="md">
      {/* KPIs */}
      <Group>
        <Badge size="lg" variant="light">Pending: 2</Badge>
        <Badge size="lg" variant="light" color="green">Approved: $1,197</Badge>
        <Card style={{ padding: '8px 16px' }}>
          <Text size="xs" c="dimmed">Date range</Text>
          <Text size="sm">Feb 1 - Feb 15, 2024</Text>
        </Card>
      </Group>

      {/* Side by side tables */}
      <Group align="flex-start" grow>
        {/* Expense Claims */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="sm">Expense Claims</Text>
          <Table highlightOnHover data-testid="table-expense-claims" data-sort-model={JSON.stringify(expensesSortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Claim ID</Th>
                <Th>Amount</Th>
                <Th sortable sorted={expensesSortBy === 'submitted'} reversed={expensesSortDirection === 'desc'} onSort={() => handleExpensesSort('submitted')}>Submitted</Th>
                <Th sortable sorted={expensesSortBy === 'status'} reversed={expensesSortDirection === 'desc'} onSort={() => handleExpensesSort('status')}>Status</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedExpenses.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td style={{ fontSize: 12 }}>{row.claimId}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>${row.amount.toFixed(2)}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.submitted}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Travel Requests */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="sm">Travel Requests</Text>
          <Table highlightOnHover data-testid="table-travel-requests" data-sort-model={JSON.stringify(travelSortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Request ID</Th>
                <Th>Destination</Th>
                <Th sortable sorted={travelSortBy === 'requestDate'} reversed={travelSortDirection === 'desc'} onSort={() => handleTravelSort('requestDate')}>Date</Th>
                <Th>Status</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {travelRequestsData.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td style={{ fontSize: 12 }}>{row.requestId}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.destination}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.requestDate}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Group>
    </Stack>
  );
}
