'use client';

/**
 * data_grid_row_selection-mantine-T02: Select two teams for a roster export
 *
 * A centered isolated card titled "Teams" contains a Mantine Table with a leading Checkbox column for row
 * selection.
 * Spacing is comfortable and scale is default. The table shows 12 rows (no pagination) with columns: Team
 * ID, Team name, Members.
 * Initial state: no teams selected. Selecting rows updates a small text below the table ("Selected: N") but
 * no confirmation is required.
 * Both target rows are visible without scrolling.
 *
 * Success: selected_row_ids equals ['team_T07', 'team_T12']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface TeamData {
  key: string;
  teamId: string;
  teamName: string;
  members: number;
}

const teamsData: TeamData[] = [
  { key: 'team_T01', teamId: 'T-01', teamName: 'Engineering', members: 12 },
  { key: 'team_T02', teamId: 'T-02', teamName: 'Product', members: 5 },
  { key: 'team_T03', teamId: 'T-03', teamName: 'Sales', members: 8 },
  { key: 'team_T04', teamId: 'T-04', teamName: 'Support', members: 6 },
  { key: 'team_T05', teamId: 'T-05', teamName: 'Finance', members: 4 },
  { key: 'team_T06', teamId: 'T-06', teamName: 'HR', members: 3 },
  { key: 'team_T07', teamId: 'T-07', teamName: 'Design', members: 7 },
  { key: 'team_T08', teamId: 'T-08', teamName: 'Legal', members: 2 },
  { key: 'team_T09', teamId: 'T-09', teamName: 'Operations', members: 9 },
  { key: 'team_T10', teamId: 'T-10', teamName: 'QA', members: 5 },
  { key: 'team_T11', teamId: 'T-11', teamName: 'DevOps', members: 4 },
  { key: 'team_T12', teamId: 'T-12', teamName: 'Marketing', members: 6 },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const toggleRow = (key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(Array.from(selectedKeys), ['team_T07', 'team_T12'])) {
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="md" mb="md">Teams</Text>
      <Table
        highlightOnHover
        data-testid="teams-table"
        data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }} />
            <Table.Th>Team ID</Table.Th>
            <Table.Th>Team name</Table.Th>
            <Table.Th>Members</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {teamsData.map((row) => (
            <Table.Tr
              key={row.key}
              bg={selectedKeys.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined}
              data-row-id={row.key}
              data-selected={selectedKeys.has(row.key)}
            >
              <Table.Td>
                <Checkbox
                  checked={selectedKeys.has(row.key)}
                  onChange={() => toggleRow(row.key)}
                  aria-label={`Select ${row.teamName}`}
                />
              </Table.Td>
              <Table.Td>{row.teamId}</Table.Td>
              <Table.Td>{row.teamName}</Table.Td>
              <Table.Td>{row.members}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Text size="sm" c="dimmed" mt="md">Selected: {selectedKeys.size}</Text>
    </Card>
  );
}
