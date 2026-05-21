'use client';

/**
 * select_native-mantine-v2-T30: Team table — change Alice role to Editor and save row
 *
 * Three-row team table centered on a busy admin page. Each row has a Mantine NativeSelect
 * for "Role" and a row-local Save button. Alice starts at Viewer. Bob=Editor, Cara=Admin.
 * Row-local save commits the role.
 *
 * Success: Alice committed role = "editor"/"Editor", row Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, TextInput, Group, Table, Pagination, Box } from '@mantine/core';
import { IconSearch, IconUserPlus } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

const roleOptions = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' },
];

const initialMembers = [
  { name: 'Alice', email: 'alice@example.com', role: 'viewer' },
  { name: 'Bob', email: 'bob@example.com', role: 'editor' },
  { name: 'Cara', email: 'cara@example.com', role: 'admin' },
];

export default function T30({ onSuccess }: TaskComponentProps) {
  const [members, setMembers] = useState(initialMembers);
  const [committedRoles, setCommittedRoles] = useState<Record<string, string>>(
    Object.fromEntries(initialMembers.map(m => [m.name, m.role]))
  );
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedRoles['Alice'] === 'editor') {
      successFired.current = true;
      onSuccess();
    }
  }, [committedRoles, onSuccess]);

  const handleRoleChange = (name: string, newRole: string) => {
    setMembers(prev => prev.map(m => m.name === name ? { ...m, role: newRole } : m));
  };

  const handleRowSave = (name: string) => {
    const member = members.find(m => m.name === name);
    if (member) {
      setCommittedRoles(prev => ({ ...prev, [name]: member.role }));
    }
  };

  return (
    <Box p="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 620 }}>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Team</Text>
          <Group gap="sm">
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              size="xs"
              style={{ width: 160 }}
            />
            <Button size="xs" leftSection={<IconUserPlus size={14} />}>Add member</Button>
          </Group>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {members.map(member => (
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
                <Table.Td>
                  <Button size="xs" variant="outline" onClick={() => handleRowSave(member.name)}>
                    Save
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination total={1} value={1} />
        </Group>
      </Card>
    </Box>
  );
}
