'use client';

/**
 * datetime_picker_range-mantine-T10: SLA table: edit the Silver row window (composite)
 *
 * Layout: table_cell view centered in the viewport (a small admin table).
 * Light theme, comfortable spacing, default scale.
 * There are two rows ("Gold" and "Silver"). Each row contains a composite date-time range editor embedded in the table:
 * a Start DateTimePicker cell and an End DateTimePicker cell (together treated as one canonical datetime range instance per row).
 * The Gold row is pre-filled with a different range; the Silver row Start/End are empty.
 * Medium clutter comes from other non-interactive columns (SLA name, description) and a couple of action icons per row, but they do not affect success.
 *
 * Success: The Silver row equals start=2026-06-15T14:00:00, end=2026-06-15T16:00:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Table, ActionIcon, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  // Gold row (pre-filled)
  const [goldStart] = useState<Date | null>(
    dayjs('2026-06-15 08:00', 'YYYY-MM-DD HH:mm').toDate()
  );
  const [goldEnd] = useState<Date | null>(
    dayjs('2026-06-15 12:00', 'YYYY-MM-DD HH:mm').toDate()
  );

  // Silver row (empty, target)
  const [silverStart, setSilverStart] = useState<Date | null>(null);
  const [silverEnd, setSilverEnd] = useState<Date | null>(null);

  useEffect(() => {
    if (silverStart && silverEnd) {
      const startMatch = dayjs(silverStart).format('YYYY-MM-DD HH:mm') === '2026-06-15 14:00';
      const endMatch = dayjs(silverEnd).format('YYYY-MM-DD HH:mm') === '2026-06-15 16:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [silverStart, silverEnd, onSuccess]);

  const rows = [
    {
      name: 'Gold',
      description: 'Premium support tier',
      start: goldStart,
      end: goldEnd,
      setStart: () => {},
      setEnd: () => {},
      disabled: true,
      instance: 'SLA table > Gold',
    },
    {
      name: 'Silver',
      description: 'Standard support tier',
      start: silverStart,
      end: silverEnd,
      setStart: setSilverStart,
      setEnd: setSilverEnd,
      disabled: false,
      instance: 'SLA table > Silver',
    },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">SLA Table</Text>
      <Text size="sm" c="dimmed" mb="md">
        Columns include: Response window (Start, End)
        <br />
        Gold row is pre-filled; Silver row is empty.
      </Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Tier</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Window Start</Table.Th>
            <Table.Th>Window End</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.name} data-cb-instance={row.instance}>
              <Table.Td>
                <Text fw={500}>{row.name}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">{row.description}</Text>
              </Table.Td>
              <Table.Td>
                <DateTimePicker
                  size="xs"
                  value={row.start}
                  onChange={row.setStart}
                  placeholder="Start"
                  disabled={row.disabled}
                  data-testid={`dt-range-${row.name.toLowerCase()}-start`}
                  valueFormat="YYYY-MM-DD HH:mm"
                  style={{ width: 160 }}
                />
              </Table.Td>
              <Table.Td>
                <DateTimePicker
                  size="xs"
                  value={row.end}
                  onChange={row.setEnd}
                  placeholder="End"
                  disabled={row.disabled}
                  data-testid={`dt-range-${row.name.toLowerCase()}-end`}
                  valueFormat="YYYY-MM-DD HH:mm"
                  style={{ width: 160 }}
                />
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" size="sm">
                    <IconEdit size={14} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" size="sm" color="red">
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
