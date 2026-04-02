'use client';

/**
 * date_input_text-mantine-T08: Mantine edit a date input inside a dense table
 * 
 * Layout: table_cell scene anchored at the bottom-right of the viewport.
 * Theme/spacing: light theme with compact spacing; small component scale.
 * Table: three rows labeled "Server A", "Server B", "Server C".
 * Component instances: each row has an inline Mantine DateInput in the "Maintenance date" column (valueFormat YYYY-MM-DD).
 * Initial state:
 *   - Server A: 2026-08-15
 *   - Server B: empty
 *   - Server C: 2026-10-20
 * Clutter (high): additional columns show status pills and action icons; these do not affect success.
 * Feedback: the edited cell updates after the input is committed and briefly shows a subtle background highlight.
 * 
 * Success: In the "Server B" row, the "Maintenance date" DateInput value equals 2026-09-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Table, Badge, ActionIcon, Group } from '@mantine/core';
import { IconSettings, IconTrash } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

interface ServerRow {
  name: string;
  date: Date | null;
  status: 'online' | 'offline' | 'maintenance';
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<ServerRow[]>([
    { name: 'Server A', date: new Date('2026-08-15'), status: 'online' },
    { name: 'Server B', date: null, status: 'offline' },
    { name: 'Server C', date: new Date('2026-10-20'), status: 'maintenance' },
  ]);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  useEffect(() => {
    const serverB = data.find(row => row.name === 'Server B');
    if (serverB?.date && dayjs(serverB.date).format('YYYY-MM-DD') === '2026-09-01') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleDateChange = (serverName: string, newDate: Date | null) => {
    setData(prev => prev.map(row =>
      row.name === serverName ? { ...row, date: newDate } : row
    ));
    setHighlightedRow(serverName);
    setTimeout(() => setHighlightedRow(null), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green';
      case 'offline': return 'red';
      case 'maintenance': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Maintenance Schedule</Text>
      
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Server</Table.Th>
            <Table.Th>Maintenance date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row) => (
            <Table.Tr
              key={row.name}
              data-row-key={row.name}
              style={{
                backgroundColor: highlightedRow === row.name ? '#e7f5ff' : undefined,
                transition: 'background-color 0.3s',
              }}
            >
              <Table.Td>{row.name}</Table.Td>
              <Table.Td style={{ minWidth: 180 }}>
                <DateInput
                  value={row.date}
                  onChange={(date) => handleDateChange(row.name, date)}
                  valueFormat="YYYY-MM-DD"
                  placeholder="YYYY-MM-DD"
                  size="sm"
                  data-testid={`maintenance-date-${row.name.toLowerCase().replace(' ', '-')}`}
                />
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(row.status)} size="sm">
                  {row.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" size="sm">
                    <IconSettings size={14} />
                  </ActionIcon>
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
