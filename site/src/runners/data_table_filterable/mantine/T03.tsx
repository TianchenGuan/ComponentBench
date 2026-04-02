'use client';

/**
 * data_table_filterable-mantine-T03: Clear all filters (toolbar button)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. Mantine composite filterable table with a toolbar above the table.
 *
 * Toolbar controls: Search name TextInput, Status Select, Country Select, and a right-aligned button labeled "Clear filters".
 *
 * Initial state: filters are already active — Search name contains 'an' and Status is set to Paused. Country is All.
 *
 * Success: Global filter is empty/null. No column filters are active (all dropdowns at All).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, TextInput, Select, Group, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
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
  { id: '2', name: 'Bob Branson', email: 'bob@example.com', status: 'Trial', country: 'Canada' },
  { id: '3', name: 'Carol Shannon', email: 'carol@example.com', status: 'Paused', country: 'UK' },
  { id: '4', name: 'David Anderson', email: 'david@example.com', status: 'Active', country: 'Germany' },
  { id: '5', name: 'Eva Santana', email: 'eva@example.com', status: 'Paused', country: 'France' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', status: 'Active', country: 'Japan' },
  { id: '7', name: 'Grace Moran', email: 'grace@example.com', status: 'Paused', country: 'Australia' },
  { id: '8', name: 'Henry Chan', email: 'henry@example.com', status: 'Active', country: 'China' },
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

export default function T03({ onSuccess }: TaskComponentProps) {
  // Start with pre-applied filters
  const [searchName, setSearchName] = useState('an');
  const [statusFilter, setStatusFilter] = useState<string | null>('Paused');
  const [countryFilter, setCountryFilter] = useState<string | null>('All');
  const successFiredRef = useRef(false);
  const [interactionStarted, setInteractionStarted] = useState(false);

  // Filter data
  const filteredData = usersData.filter(user => {
    if (searchName && !user.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (statusFilter && statusFilter !== 'All' && user.status !== statusFilter) return false;
    if (countryFilter && countryFilter !== 'All' && user.country !== countryFilter) return false;
    return true;
  });

  const handleClearFilters = () => {
    setInteractionStarted(true);
    setSearchName('');
    setStatusFilter('All');
    setCountryFilter('All');
  };

  // Check success condition
  useEffect(() => {
    if (!interactionStarted) return;
    
    if (
      searchName === '' &&
      (statusFilter === 'All' || !statusFilter) &&
      (countryFilter === 'All' || !countryFilter) &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [searchName, statusFilter, countryFilter, interactionStarted, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'users_mantine',
    logic_operator: 'AND',
    global_filter: searchName || null,
    column_filters: [
      ...(statusFilter && statusFilter !== 'All' ? [{ column: 'Status', operator: 'equals' as const, value: statusFilter }] : []),
      ...(countryFilter && countryFilter !== 'All' ? [{ column: 'Country', operator: 'equals' as const, value: countryFilter }] : []),
    ],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 800 }}>
      {/* Filter toolbar */}
      <Group mb="md" justify="space-between">
        <Group gap="md">
          <TextInput
            label="Search name"
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            value={searchName}
            onChange={(e) => { setInteractionStarted(true); setSearchName(e.currentTarget.value); }}
            style={{ width: 180 }}
            data-testid="search-name-input"
          />
          <Select
            label="Status"
            data={statusOptions}
            value={statusFilter}
            onChange={(val) => { setInteractionStarted(true); setStatusFilter(val); }}
            style={{ width: 130 }}
            data-testid="status-filter"
          />
          <Select
            label="Country"
            data={countryOptions}
            value={countryFilter}
            onChange={(val) => { setInteractionStarted(true); setCountryFilter(val); }}
            style={{ width: 130 }}
            data-testid="country-filter"
          />
        </Group>
        <Button variant="outline" onClick={handleClearFilters} mt="auto">
          Clear filters
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
