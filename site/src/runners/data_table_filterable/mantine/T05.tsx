'use client';

/**
 * data_table_filterable-mantine-T05: Signup date range (July 2024)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. Mantine composite filterable table.
 *
 * Toolbar includes a DatePickerInput in range mode labeled "Signup date", showing two date fields within one control.
 *
 * There is an "Apply filters" button; date selection is staged and only applied after clicking Apply filters.
 *
 * Initial state: no filters active; date range empty.
 *
 * Success: Signup date filter is set to [2024-07-01, 2024-07-31] inclusive. Applied via Apply filters.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Group, Button } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import type { TaskComponentProps, FilterModel } from '../types';

interface UserData {
  id: string;
  name: string;
  email: string;
  signupDate: string;
}

const usersData: UserData[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', signupDate: '2024-06-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', signupDate: '2024-07-05' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', signupDate: '2024-07-15' },
  { id: '4', name: 'David Brown', email: 'david@example.com', signupDate: '2024-07-31' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', signupDate: '2024-08-10' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', signupDate: '2024-07-01' },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', signupDate: '2024-07-20' },
  { id: '8', name: 'Henry Chen', email: 'henry@example.com', signupDate: '2024-09-01' },
];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [pendingDateRange, setPendingDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [appliedDateRange, setAppliedDateRange] = useState<[string, string] | null>(null);
  const successFiredRef = useRef(false);

  // Filter data based on applied date range
  const filteredData = usersData.filter(user => {
    if (!appliedDateRange) return true;
    const userDate = new Date(user.signupDate);
    const startDate = new Date(appliedDateRange[0]);
    const endDate = new Date(appliedDateRange[1]);
    return userDate >= startDate && userDate <= endDate;
  });

  const handleApply = () => {
    if (pendingDateRange[0] && pendingDateRange[1]) {
      setAppliedDateRange([
        formatDate(pendingDateRange[0]),
        formatDate(pendingDateRange[1]),
      ]);
    }
  };

  // Check success condition
  useEffect(() => {
    if (
      appliedDateRange &&
      appliedDateRange[0] === '2024-07-01' &&
      appliedDateRange[1] === '2024-07-31' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedDateRange, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'users_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedDateRange
      ? [{
          column: 'Signup date',
          operator: 'date_between_inclusive' as const,
          value: { start: appliedDateRange[0], end: appliedDateRange[1] },
        }]
      : [],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      {/* Filter toolbar */}
      <Group mb="md" justify="space-between">
        <DatePickerInput
          type="range"
          label="Signup date"
          placeholder="Select date range"
          value={pendingDateRange}
          onChange={setPendingDateRange}
          style={{ width: 300 }}
          data-testid="signup-date-range"
        />
        <Button onClick={handleApply} mt="auto">
          Apply filters
        </Button>
      </Group>

      <Text fw={500} size="md" mb="md">Users</Text>
      <Table
        highlightOnHover
        data-testid="table-users"
        data-filter-model={JSON.stringify(filterModel)}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Signup date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.email}</Table.Td>
              <Table.Td>{row.signupDate}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
