'use client';

/**
 * data_table_filterable-mantine-T04: Tags filter (VIP + Overdue) with Apply
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. Mantine composite filterable table.
 *
 * Toolbar controls: MultiSelect labeled "Tags" (options include VIP, Overdue, New, Churn-risk, Internal), plus an "Apply
 * filters" button on the right.
 *
 * Interaction: selecting tags updates a pending selection, but does NOT filter the table until Apply filters is clicked.
 *
 * Initial state: no filters active; Tags selection empty.
 *
 * Success: Tags filter is applied and contains all of: VIP, Overdue. Applied via Apply filters.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, MultiSelect, Group, Button } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../types';

interface UserData {
  id: string;
  name: string;
  email: string;
  tags: string[];
}

const usersData: UserData[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', tags: ['VIP', 'New'] },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', tags: ['Overdue'] },
  { id: '3', name: 'Carol White', email: 'carol@example.com', tags: ['VIP', 'Overdue'] },
  { id: '4', name: 'David Brown', email: 'david@example.com', tags: ['Internal'] },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', tags: ['Churn-risk', 'Overdue'] },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', tags: ['VIP'] },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', tags: ['New', 'VIP', 'Overdue'] },
  { id: '8', name: 'Henry Chen', email: 'henry@example.com', tags: [] },
];

const tagOptions = ['VIP', 'Overdue', 'New', 'Churn-risk', 'Internal'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [pendingTags, setPendingTags] = useState<string[]>([]);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const successFiredRef = useRef(false);

  // Filter data based on applied tags
  const filteredData = usersData.filter(user => {
    if (appliedTags.length === 0) return true;
    return appliedTags.every(tag => user.tags.includes(tag));
  });

  const handleApply = () => {
    setAppliedTags([...pendingTags]);
  };

  // Check success condition
  useEffect(() => {
    if (
      appliedTags.length === 2 &&
      appliedTags.includes('VIP') &&
      appliedTags.includes('Overdue') &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedTags, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'users_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedTags.length > 0
      ? [{ column: 'Tags', operator: 'contains_all' as const, value: appliedTags }]
      : [],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      {/* Filter toolbar */}
      <Group mb="md" justify="space-between">
        <MultiSelect
          label="Tags"
          placeholder="Select tags"
          data={tagOptions}
          value={pendingTags}
          onChange={setPendingTags}
          style={{ width: 300 }}
          data-testid="tags-filter"
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
            <Table.Th>Tags</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.email}</Table.Td>
              <Table.Td>{row.tags.join(', ') || '-'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
