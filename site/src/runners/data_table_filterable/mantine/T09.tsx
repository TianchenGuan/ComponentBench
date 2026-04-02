'use client';

/**
 * data_table_filterable-mantine-T09: Top-right: Match reference chips (visual)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=top_right; scale=default;
 * instances=1; guidance=visual; clutter=none.
 *
 * Layout: isolated_card placed in the top-right quadrant of the viewport.
 *
 * Above the Mantine composite Users table, a "Target filters" row displays three chips (visual reference) indicating the
 * desired Status, Country, and Tag.
 *
 * Toolbar controls correspond 1:1 with the chips: Status Select, Country Select, Tags MultiSelect, and an "Apply filters"
 * button.
 *
 * Guidance is visual: the instruction does not repeat the chip values; you must read them from the chips.
 *
 * Initial state: no filters active (Status=All, Country=All, Tags empty).
 *
 * Success: Filters match the reference chips exactly: Status=Archived, Country=Canada, Tags include VIP.
 * Applied via Apply filters.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Select, MultiSelect, Group, Button, Badge, Box } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../types';

interface UserData {
  id: string;
  name: string;
  email: string;
  status: string;
  country: string;
  tags: string[];
}

const usersData: UserData[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', country: 'USA', tags: ['VIP'] },
  { id: '2', name: 'Bob Wilson', email: 'bob@example.com', status: 'Archived', country: 'Canada', tags: ['VIP'] },
  { id: '3', name: 'Carol White', email: 'carol@example.com', status: 'Paused', country: 'UK', tags: ['New'] },
  { id: '4', name: 'David Brown', email: 'david@example.com', status: 'Archived', country: 'Canada', tags: ['VIP', 'Overdue'] },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', status: 'Active', country: 'Germany', tags: [] },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', status: 'Archived', country: 'Japan', tags: ['Internal'] },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', status: 'Archived', country: 'Canada', tags: ['New', 'VIP'] },
  { id: '8', name: 'Henry Chen', email: 'henry@example.com', status: 'Active', country: 'Canada', tags: ['VIP'] },
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
  { value: 'Japan', label: 'Japan' },
];

const tagOptions = ['VIP', 'New', 'Overdue', 'Internal', 'Churn-risk'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [pendingStatus, setPendingStatus] = useState<string | null>('All');
  const [pendingCountry, setPendingCountry] = useState<string | null>('All');
  const [pendingTags, setPendingTags] = useState<string[]>([]);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);
  const [appliedCountry, setAppliedCountry] = useState<string | null>(null);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const successFiredRef = useRef(false);

  // Filter data based on applied filters
  const filteredData = usersData.filter(user => {
    if (appliedStatus && appliedStatus !== 'All' && user.status !== appliedStatus) return false;
    if (appliedCountry && appliedCountry !== 'All' && user.country !== appliedCountry) return false;
    if (appliedTags.length > 0 && !appliedTags.every(tag => user.tags.includes(tag))) return false;
    return true;
  });

  const handleApply = () => {
    setAppliedStatus(pendingStatus);
    setAppliedCountry(pendingCountry);
    setAppliedTags([...pendingTags]);
  };

  // Check success condition
  useEffect(() => {
    if (
      appliedStatus === 'Archived' &&
      appliedCountry === 'Canada' &&
      appliedTags.length === 1 &&
      appliedTags.includes('VIP') &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedStatus, appliedCountry, appliedTags, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'users_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: [
      ...(appliedStatus && appliedStatus !== 'All' ? [{ column: 'Status', operator: 'equals' as const, value: appliedStatus }] : []),
      ...(appliedCountry && appliedCountry !== 'All' ? [{ column: 'Country', operator: 'equals' as const, value: appliedCountry }] : []),
      ...(appliedTags.length > 0 ? [{ column: 'Tags', operator: 'contains_all' as const, value: appliedTags }] : []),
    ],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 800 }}>
      {/* Target filters reference chips */}
      <Box mb="md" p="sm" style={{ backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 4, border: '1px solid rgba(0,0,0,0.1)' }}>
        <Text size="xs" c="dimmed" mb="xs">Target filters:</Text>
        <Group gap="xs">
          <Badge color="blue" variant="light">Status: Archived</Badge>
          <Badge color="green" variant="light">Country: Canada</Badge>
          <Badge color="orange" variant="light">Tag: VIP</Badge>
        </Group>
      </Box>

      {/* Filter toolbar */}
      <Group mb="md" justify="space-between">
        <Group gap="md">
          <Select
            label="Status"
            data={statusOptions}
            value={pendingStatus}
            onChange={setPendingStatus}
            style={{ width: 130 }}
            data-testid="status-filter"
          />
          <Select
            label="Country"
            data={countryOptions}
            value={pendingCountry}
            onChange={setPendingCountry}
            style={{ width: 130 }}
            data-testid="country-filter"
          />
          <MultiSelect
            label="Tags"
            placeholder="Select tags"
            data={tagOptions}
            value={pendingTags}
            onChange={setPendingTags}
            style={{ width: 180 }}
            data-testid="tags-filter"
          />
        </Group>
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
            <Table.Th>Status</Table.Th>
            <Table.Th>Country</Table.Th>
            <Table.Th>Tags</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.email}</Table.Td>
              <Table.Td>{row.status}</Table.Td>
              <Table.Td>{row.country}</Table.Td>
              <Table.Td>{row.tags.join(', ') || '-'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
