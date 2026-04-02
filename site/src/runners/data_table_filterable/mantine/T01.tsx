'use client';

/**
 * data_table_filterable-mantine-T01: Users: Status = Active (select)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. The filterable table is implemented as a composite Mantine component: a filter toolbar
 * above a Mantine Table.
 *
 * Spacing: comfortable; scale: default; light theme.
 *
 * Filter toolbar controls (left-to-right): a Select labeled "Status" (options: All, Active, Trial, Paused, Archived) and
 * a Select labeled "Country" (unused).
 *
 * Initial state: Status=All (no filtering), Country=All, and the table shows all rows.
 *
 * Success: Status filter equals Active. No other filters are active.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Select, Group } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../types';

interface UserData {
  id: string;
  name: string;
  email: string;
  status: string;
  country: string;
}

const usersData: UserData[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', country: 'USA' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'Trial', country: 'Canada' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', status: 'Paused', country: 'UK' },
  { id: '4', name: 'David Brown', email: 'david@example.com', status: 'Active', country: 'Germany' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', status: 'Archived', country: 'France' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', status: 'Active', country: 'Japan' },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', status: 'Trial', country: 'Australia' },
  { id: '8', name: 'Henry Chen', email: 'henry@example.com', status: 'Active', country: 'China' },
];

const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Trial', label: 'Trial' },
  { value: 'Paused', label: 'Paused' },
  { value: 'Archived', label: 'Archived' },
];

const countryOptions = [
  { value: 'All', label: 'All' },
  { value: 'USA', label: 'USA' },
  { value: 'Canada', label: 'Canada' },
  { value: 'UK', label: 'UK' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Australia', label: 'Australia' },
  { value: 'China', label: 'China' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>('All');
  const [countryFilter, setCountryFilter] = useState<string | null>('All');
  const successFiredRef = useRef(false);

  // Filter data
  const filteredData = usersData.filter(user => {
    if (statusFilter && statusFilter !== 'All' && user.status !== statusFilter) return false;
    if (countryFilter && countryFilter !== 'All' && user.country !== countryFilter) return false;
    return true;
  });

  // Check success condition
  useEffect(() => {
    if (
      statusFilter === 'Active' &&
      (countryFilter === 'All' || !countryFilter) &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [statusFilter, countryFilter, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'users_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: [
      ...(statusFilter && statusFilter !== 'All' ? [{ column: 'Status', operator: 'equals' as const, value: statusFilter }] : []),
      ...(countryFilter && countryFilter !== 'All' ? [{ column: 'Country', operator: 'equals' as const, value: countryFilter }] : []),
    ],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      {/* Filter toolbar */}
      <Group mb="md" gap="md">
        <Select
          label="Status"
          data={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          data-testid="status-filter"
        />
        <Select
          label="Country"
          data={countryOptions}
          value={countryFilter}
          onChange={setCountryFilter}
          style={{ width: 150 }}
          data-testid="country-filter"
        />
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
            <Table.Th>Status</Table.Th>
            <Table.Th>Country</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.email}</Table.Td>
              <Table.Td>{row.status}</Table.Td>
              <Table.Td>{row.country}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
