'use client';

/**
 * time_input_text-mantine-T08: Edit a small time input inside a weekly schedule table
 * 
 * Layout: table_cell anchored near the top-left. Light theme with compact spacing and small component scale.
 * A table titled "Weekly schedule" is shown with three visible rows (Monday, Tuesday, Wednesday).
 * Each row has a "Start time" cell containing a Mantine TimeInput rendered in a compact small size.
 * - Configuration: native input[type='time'], minute precision.
 * - Initial values: all three days are set to 07:00.
 * - Target: Monday's Start time.
 * Clutter=high: additional columns include "Enabled" toggles and an "Actions" menu per row (distractors).
 * 
 * Success: In the "Weekly schedule" table, the TimeInput in row "Monday" under "Start time" equals 06:45.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Table, Switch, ActionIcon, Menu } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconDotsVertical } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface DayRow {
  id: string;
  day: string;
  startTime: string;
  enabled: boolean;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [days, setDays] = useState<DayRow[]>([
    { id: 'monday', day: 'Monday', startTime: '07:00', enabled: true },
    { id: 'tuesday', day: 'Tuesday', startTime: '07:00', enabled: true },
    { id: 'wednesday', day: 'Wednesday', startTime: '07:00', enabled: false },
  ]);

  useEffect(() => {
    const monday = days.find(d => d.id === 'monday');
    if (monday && monday.startTime === '06:45') {
      onSuccess();
    }
  }, [days, onSuccess]);

  const handleTimeChange = (id: string, newTime: string) => {
    setDays(prev => prev.map(day => 
      day.id === id ? { ...day, startTime: newTime } : day
    ));
  };

  const handleToggle = (id: string) => {
    setDays(prev => prev.map(day => 
      day.id === id ? { ...day, enabled: !day.enabled } : day
    ));
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="sm">Weekly schedule</Text>
      
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Day</Table.Th>
            <Table.Th>Start time</Table.Th>
            <Table.Th>Enabled</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {days.map((day) => (
            <Table.Tr key={day.id} data-row={day.id}>
              <Table.Td>{day.day}</Table.Td>
              <Table.Td data-col="start-time">
                <TimeInput
                  value={day.startTime}
                  onChange={(event) => handleTimeChange(day.id, event.currentTarget.value)}
                  size="xs"
                  style={{ width: 100 }}
                  data-testid={`start-time-${day.id}`}
                />
              </Table.Td>
              <Table.Td>
                <Switch
                  checked={day.enabled}
                  onChange={() => handleToggle(day.id)}
                  size="xs"
                />
              </Table.Td>
              <Table.Td>
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="subtle" size="sm">
                      <IconDotsVertical size={14} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item color="red">Delete</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
