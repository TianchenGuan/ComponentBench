'use client';

/**
 * switch-mantine-T07: Table row toggle: make Team A visible
 *
 * Layout: table_cell centered in the viewport with heading "Teams".
 * A Mantine Table shows columns: Team, Members, and "Visible" (switches in the last column).
 * Three rows are visible: "Team A" (target), "Team B", and "Team C".
 * Each row contains an identical Mantine Switch in the "Visible" column; the switches are closely aligned making them easy to confuse.
 * Initial state: "Team A" has Visible OFF.
 * Clutter: high — the table includes striped rows and a small filter input above it; only the target switch state is checked.
 * Feedback: toggling the switch updates immediately; no confirmation.
 */

import React, { useState } from 'react';
import { Card, Switch, Text, Table, TextInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface Team {
  id: string;
  name: string;
  members: number;
  visible: boolean;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<Team[]>([
    { id: 'team-a', name: 'Team A', members: 5, visible: false },
    { id: 'team-b', name: 'Team B', members: 8, visible: true },
    { id: 'team-c', name: 'Team C', members: 3, visible: false },
  ]);

  const handleSwitchChange = (id: string, checked: boolean) => {
    setData(prev => prev.map(row => 
      row.id === id ? { ...row, visible: checked } : row
    ));
    if (id === 'team-a' && checked) {
      onSuccess();
    }
  };

  const rows = data.map((row) => (
    <Table.Tr key={row.id} data-team-id={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.members}</Table.Td>
      <Table.Td>
        <Switch
          checked={row.visible}
          onChange={(e) => handleSwitchChange(row.id, e.currentTarget.checked)}
          data-testid={`visible-${row.id}`}
          aria-checked={row.visible}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="lg" mb="md">Teams</Text>
      <TextInput
        placeholder="Filter teams..."
        mb="md"
        size="sm"
      />
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team</Table.Th>
            <Table.Th>Members</Table.Th>
            <Table.Th>Visible</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
}
