'use client';

/**
 * select_native-mantine-T10: Change Alice role to Editor (small table)
 *
 * Layout: a "Team" table displayed in the center of the page with three rows.
 * Columns:
 * - Name
 * - Email
 * - Role (native select in each row)  ← TARGET COLUMN
 *
 * Each Role cell contains a Mantine NativeSelect (table cell styling).
 * Role options (label → value):
 * - Viewer → viewer
 * - Editor → editor  ← TARGET
 * - Admin → admin
 *
 * Rows:
 * 1) Alice (alice@example.com), initial Role: Viewer  ← TARGET ROW
 * 2) Bob (bob@example.com), initial Role: Editor
 * 3) Carol (carol@example.com), initial Role: Admin
 *
 * Clutter: high — above the table is a search box and "Invite member" button; below is pagination (non-functional for success).
 * Feedback: selecting a role updates the cell immediately; no Save button.
 *
 * Success: The target native select labeled "Role for Alice" has selected option value 'editor' (label 'Editor').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, TextInput, Button, Table, Group, Pagination } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const roleOptions = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' },
];

const initialMembers = [
  { name: 'Alice', email: 'alice@example.com', role: 'viewer' },
  { name: 'Bob', email: 'bob@example.com', role: 'editor' },
  { name: 'Carol', email: 'carol@example.com', role: 'admin' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState('');

  const handleRoleChange = (memberName: string, newRole: string) => {
    setMembers(prev => 
      prev.map(m => m.name === memberName ? { ...m, role: newRole } : m)
    );
    if (memberName === 'Alice' && newRole === 'editor') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Team</Text>
        <Group gap="sm">
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="sm"
            style={{ width: 180 }}
          />
          <Button size="sm">Invite member</Button>
        </Group>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {members.map((member) => (
            <Table.Tr key={member.name} data-row={member.name.toLowerCase()}>
              <Table.Td>{member.name}</Table.Td>
              <Table.Td>{member.email}</Table.Td>
              <Table.Td>
                <NativeSelect
                  data-testid={`role-${member.name.toLowerCase()}`}
                  data-canonical-type="select_native"
                  data-selected-value={member.role}
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.name, e.target.value)}
                  data={roleOptions}
                  size="xs"
                  style={{ width: 100 }}
                  aria-label={`Role for ${member.name}`}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Pagination total={1} value={1} />
      </Group>
    </Card>
  );
}
