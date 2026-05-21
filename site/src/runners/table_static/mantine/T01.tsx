'use client';

/**
 * table_static-mantine-T01: Select a team member row
 *
 * A centered isolated card shows a read-only Team Directory table rendered with Mantine Table. Columns:
 * Name, Role, Location. The table has ~10 rows and no pagination, sorting, or filters. Clicking a row highlights it (single-select)
 * and sets aria-selected="true" on that row. Initial state: no row selected. No other interactive elements are present.
 */

import React, { useState } from 'react';
import { Table, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface TeamMemberData {
  key: string;
  name: string;
  role: string;
  location: string;
}

const teamMembersData: TeamMemberData[] = [
  { key: 'Rina Sato', name: 'Rina Sato', role: 'Engineering Lead', location: 'Tokyo' },
  { key: 'John Smith', name: 'John Smith', role: 'Product Manager', location: 'New York' },
  { key: 'Maria Garcia', name: 'Maria Garcia', role: 'Designer', location: 'Barcelona' },
  { key: 'Alex Kim', name: 'Alex Kim', role: 'Backend Developer', location: 'Seoul' },
  { key: 'Emma Wilson', name: 'Emma Wilson', role: 'Frontend Developer', location: 'London' },
  { key: 'Lucas Brown', name: 'Lucas Brown', role: 'DevOps Engineer', location: 'Sydney' },
  { key: 'Sophie Chen', name: 'Sophie Chen', role: 'Data Scientist', location: 'Singapore' },
  { key: 'Michael Lee', name: 'Michael Lee', role: 'QA Engineer', location: 'San Francisco' },
  { key: 'Anna Mueller', name: 'Anna Mueller', role: 'UX Researcher', location: 'Berlin' },
  { key: 'David Park', name: 'David Park', role: 'Tech Lead', location: 'Vancouver' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: TeamMemberData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'Rina Sato') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={500} size="md" mb="md">Team Directory</Text>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Location</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {teamMembersData.map((row) => (
            <Table.Tr
              key={row.key}
              onClick={() => handleRowClick(row)}
              aria-selected={selectedRowKey === row.key}
              data-row-key={row.key}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRowKey === row.key ? 'var(--mantine-color-blue-light)' : undefined,
              }}
            >
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.role}</Table.Td>
              <Table.Td>{row.location}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
