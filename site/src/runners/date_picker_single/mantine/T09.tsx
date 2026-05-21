'use client';

/**
 * date_picker_single-mantine-T09: Set Milestone B date in a table using a mixed reference
 *
 * Scene: A table_cell layout containing a "Milestones" table with three rows (A, B, C).
 * Theme is light with comfortable spacing. Clutter is high due to table controls (sorting, row actions, search) and additional columns.
 *
 * Reference: Above the table, a "Reference chip" shows the target date in mixed form:
 * - A short formatted text date (e.g., "Tue Oct 6, 2026").
 * - A small calendar icon with the day number.
 *
 * Target components: Each milestone row has a Mantine DatePickerInput in the "Target date" column:
 * - Milestone A date (distractor)
 * - Milestone B date (TARGET)
 * - Milestone C date (distractor)
 * Initial state: all three date inputs are empty.
 *
 * Interaction: Click into the Milestone B date cell to open its popover calendar and pick the referenced date.
 *
 * Feedback: The chosen date appears in the Milestone B cell; other rows remain unchanged.
 *
 * Success: Target instance (Milestone B) must have selected date = 2026-10-06.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Table, TextInput, Box, Badge, ActionIcon, Group } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [milestoneADate, setMilestoneADate] = useState<Date | null>(null);
  const [milestoneBDate, setMilestoneBDate] = useState<Date | null>(null);
  const [milestoneCDate, setMilestoneCDate] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (milestoneBDate && dayjs(milestoneBDate).format('YYYY-MM-DD') === '2026-10-06') {
      onSuccess();
    }
  }, [milestoneBDate, onSuccess]);

  const rows = [
    { id: 'A', name: 'Milestone A', status: 'pending', dateValue: milestoneADate, setDate: setMilestoneADate, testId: 'milestone-a' },
    { id: 'B', name: 'Milestone B', status: 'in-progress', dateValue: milestoneBDate, setDate: setMilestoneBDate, testId: 'milestone-b' },
    { id: 'C', name: 'Milestone C', status: 'pending', dateValue: milestoneCDate, setDate: setMilestoneCDate, testId: 'milestone-c' },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Milestones</Text>

      {/* Reference Chip */}
      <Box
        data-testid="reference-chip"
        style={{
          background: '#fff7e6',
          border: '1px solid #ffd591',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text size="sm" c="dimmed">Reference:</Text>
        <Badge color="orange" size="lg">Tue Oct 6, 2026</Badge>
        <Box
          style={{
            background: '#fa8c16',
            color: '#fff',
            borderRadius: 4,
            padding: '4px 8px',
            textAlign: 'center',
            minWidth: 32,
          }}
        >
          <Text size="lg" fw={700} style={{ lineHeight: 1 }}>6</Text>
        </Box>
      </Box>

      {/* Search */}
      <TextInput
        placeholder="Search milestones..."
        leftSection={<IconSearch size={16} />}
        value={searchText}
        onChange={(e) => setSearchText(e.currentTarget.value)}
        mb="md"
        size="sm"
        data-testid="milestone-search"
      />

      {/* Table */}
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Milestone</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Target date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>
                <Badge
                  color={row.status === 'in-progress' ? 'blue' : 'gray'}
                  variant="light"
                >
                  {row.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <DatePickerInput
                  value={row.dateValue}
                  onChange={row.setDate}
                  valueFormat="YYYY-MM-DD"
                  placeholder="Pick date"
                  size="xs"
                  data-testid={row.testId}
                  style={{ minWidth: 130 }}
                />
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="red" size="sm">
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
