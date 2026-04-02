'use client';

/**
 * toggle_button_group_multi-mantine-T26: Update weekly digest delivery in table
 *
 * Layout: table_cell centered in the viewport.
 *
 * The page contains a "Subscriptions" table with three rows:
 * - Daily summary
 * - Weekly digest
 * - Monthly invoice
 *
 * Columns: Subscription, Delivery methods, Status.
 *
 * In the "Delivery methods" column, each row contains a Mantine Chip.Group 
 * (multiple selection) with three chips:
 * - Email
 * - SMS
 * - Push
 *
 * Initial states:
 * - Daily summary: Email and Push selected.
 * - Weekly digest (TARGET): Email and SMS selected.
 * - Monthly invoice: Email selected only.
 *
 * Clutter (medium):
 * - A search field above the table.
 * - Status pills in the last column.
 *
 * No Save button; updating a row shows immediate chip state change.
 *
 * Success: Weekly digest → Delivery methods: Email + Push (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Table, TextInput, Chip, Group, Badge } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const METHODS = ['Email', 'SMS', 'Push'];
const TARGET_SET = new Set(['Email', 'Push']);

export default function T06({ onSuccess }: TaskComponentProps) {
  const [dailyMethods, setDailyMethods] = useState<string[]>(['Email', 'Push']);
  const [weeklyMethods, setWeeklyMethods] = useState<string[]>(['Email', 'SMS']);
  const [monthlyMethods, setMonthlyMethods] = useState<string[]>(['Email']);
  const successFiredRef = useRef(false);

  // Initial states for non-target rows
  const dailyInitial = useRef(['Email', 'Push']);
  const monthlyInitial = useRef(['Email']);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if weekly has the target set
    const weeklySet = new Set(weeklyMethods);
    const weeklyMatches = weeklySet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => weeklySet.has(v));

    // Check if non-target rows are unchanged
    const dailyUnchanged = JSON.stringify([...dailyMethods].sort()) === 
      JSON.stringify([...dailyInitial.current].sort());
    const monthlyUnchanged = JSON.stringify([...monthlyMethods].sort()) === 
      JSON.stringify([...monthlyInitial.current].sort());

    if (weeklyMatches && dailyUnchanged && monthlyUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [weeklyMethods, dailyMethods, monthlyMethods, onSuccess]);

  const renderMethods = (
    methods: string[], 
    setMethods: (v: string[]) => void, 
    rowKey: string
  ) => (
    <Chip.Group 
      multiple 
      value={methods} 
      onChange={setMethods}
      data-testid={`methods-${rowKey.toLowerCase().replace(' ', '-')}`}
      data-row={rowKey}
    >
      <Group gap="xs">
        {METHODS.map(method => (
          <Chip 
            key={method} 
            value={method} 
            size="xs"
            data-testid={`${rowKey.toLowerCase().replace(' ', '-')}-${method.toLowerCase()}`}
          >
            {method}
          </Chip>
        ))}
      </Group>
    </Chip.Group>
  );

  const rows = [
    { name: 'Daily summary', status: 'Active', methods: dailyMethods, setMethods: setDailyMethods },
    { name: 'Weekly digest', status: 'Active', methods: weeklyMethods, setMethods: setWeeklyMethods },
    { name: 'Monthly invoice', status: 'Paused', methods: monthlyMethods, setMethods: setMonthlyMethods },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 650 }}>
      <Text fw={500} size="lg" mb="sm">Subscriptions</Text>

      <TextInput
        placeholder="Search subscriptions..."
        leftSection={<IconSearch size={16} />}
        mb="md"
        style={{ width: 200 }}
        data-testid="search-subscriptions"
      />

      <Text size="sm" c="dimmed" mb="sm">
        Set Weekly digest to Email + Push.
      </Text>

      <Table striped highlightOnHover data-testid="subscriptions-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Subscription</Table.Th>
            <Table.Th>Delivery methods</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map(row => (
            <Table.Tr key={row.name}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{renderMethods(row.methods, row.setMethods, row.name)}</Table.Td>
              <Table.Td>
                <Badge 
                  color={row.status === 'Active' ? 'green' : 'gray'}
                  variant="light"
                >
                  {row.status}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
