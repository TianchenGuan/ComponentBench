'use client';

/**
 * data_table_filterable-mantine-T02: Users: Search name contains 'son'
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered with a Mantine composite filterable table.
 *
 * Filter toolbar includes a TextInput labeled "Search name" with a left search icon; below it is the Mantine Table of users.
 *
 * Spacing: comfortable; scale: default; light theme.
 *
 * Initial state: Search name is empty (no global filter); other filters are set to All.
 *
 * Success: Global name search query equals "son" (case-insensitive, trimmed). No column filters are restricting results.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, TextInput, Group } from '@mantine/core';
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
  { id: '2', name: 'Bob Wilson', email: 'bob@example.com', status: 'Trial', country: 'Canada' },
  { id: '3', name: 'Carol Thompson', email: 'carol@example.com', status: 'Paused', country: 'UK' },
  { id: '4', name: 'David Anderson', email: 'david@example.com', status: 'Active', country: 'Germany' },
  { id: '5', name: 'Eva Jackson', email: 'eva@example.com', status: 'Archived', country: 'France' },
  { id: '6', name: 'Frank Nelson', email: 'frank@example.com', status: 'Active', country: 'Japan' },
  { id: '7', name: 'Grace Parson', email: 'grace@example.com', status: 'Trial', country: 'Australia' },
  { id: '8', name: 'Henry Robinson', email: 'henry@example.com', status: 'Active', country: 'China' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [searchName, setSearchName] = useState('');
  const successFiredRef = useRef(false);

  // Filter data
  const filteredData = usersData.filter(user => {
    if (searchName && !user.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  // Check success condition
  useEffect(() => {
    if (
      searchName.toLowerCase().trim() === 'son' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [searchName, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'users_mantine',
    logic_operator: 'AND',
    global_filter: searchName || null,
    column_filters: [],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      {/* Filter toolbar */}
      <Group mb="md">
        <TextInput
          label="Search name"
          placeholder="Search..."
          leftSection={<IconSearch size={16} />}
          value={searchName}
          onChange={(e) => setSearchName(e.currentTarget.value)}
          style={{ width: 250 }}
          data-testid="search-name-input"
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
