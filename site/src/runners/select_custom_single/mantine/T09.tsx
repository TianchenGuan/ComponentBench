'use client';

/**
 * select_custom_single-mantine-T09: Set R. Chen access level to Read only in table
 *
 * Layout: table_cell with compact spacing and small controls.
 * A table titled "Team members" shows two visible rows: "R. Chen" and "M. Patel".
 *
 * The "Access level" column uses Mantine Select components embedded in the table cells (small size).
 * Instances: 2 selects (one per row). Target instance is the Access level select in the "R. Chen" row.
 *
 * Options are custom-rendered with a small badge on the left plus text:
 * - Read only
 * - Editor
 * - Admin
 *
 * Initial state:
 * - R. Chen: Editor  ← needs to become Read only
 * - M. Patel: Admin
 *
 * Clutter: above the table there is a search field and a "Invite member" button; these are distractors.
 *
 * Feedback: selecting an option updates the cell immediately; no Apply/OK button required.
 *
 * Success: The Access level Select for the row labeled "R. Chen" has selected value exactly "Read only".
 */

import React, { useState } from 'react';
import { Card, Text, Select, Table, TextInput, Button, Group, Badge } from '@mantine/core';
import { IconSearch, IconUserPlus } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const accessLevels = [
  { value: 'Read only', label: 'Read only', color: 'gray' },
  { value: 'Editor', label: 'Editor', color: 'blue' },
  { value: 'Admin', label: 'Admin', color: 'red' },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [accessValues, setAccessValues] = useState<Record<string, string | null>>({
    'r-chen': 'Editor',
    'm-patel': 'Admin',
  });

  const handleAccessChange = (memberId: string, newValue: string | null) => {
    setAccessValues(prev => ({ ...prev, [memberId]: newValue }));
    if (memberId === 'r-chen' && newValue === 'Read only') {
      onSuccess();
    }
  };

  const members: TeamMember[] = [
    { id: 'r-chen', name: 'R. Chen', email: 'r.chen@example.com' },
    { id: 'm-patel', name: 'M. Patel', email: 'm.patel@example.com' },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Team members</Text>
      
      <Group mb="md">
        <TextInput
          placeholder="Search members..."
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1 }}
          size="sm"
        />
        <Button leftSection={<IconUserPlus size={16} />} size="sm">
          Invite member
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Access level</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {members.map((member) => (
            <Table.Tr key={member.id}>
              <Table.Td>{member.name}</Table.Td>
              <Table.Td>{member.email}</Table.Td>
              <Table.Td>
                <Select
                  data-testid={`access-level-${member.id}`}
                  data={accessLevels}
                  value={accessValues[member.id]}
                  onChange={(value) => handleAccessChange(member.id, value)}
                  size="xs"
                  style={{ width: 130 }}
                  renderOption={({ option }) => {
                    const level = accessLevels.find(l => l.value === option.value);
                    return (
                      <Group gap="xs">
                        <Badge size="xs" color={level?.color || 'gray'} variant="dot" />
                        {option.label}
                      </Group>
                    );
                  }}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
