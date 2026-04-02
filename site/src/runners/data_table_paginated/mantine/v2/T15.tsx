'use client';

/**
 * data_table_paginated-mantine-v2-T15: Teams modal — page size 20 and page 5 in the lower table
 *
 * Modal flow: "Team Manager" button opens a Mantine Modal with two stacked
 * DataTable cards: "Users" on top, "Teams" below.
 * Initial: both page 1, size 10. Target: Teams → size 20, page 5.
 * Users must remain page 1, size 10.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Select, Button, Modal, Badge } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface SimpleUser { id: string; name: string; email: string; role: string; }
interface SimpleTeam { id: string; name: string; members: number; department: string; }

function generateUsers(count: number): SimpleUser[] {
  const roles = ['Admin', 'Editor', 'Viewer', 'Contributor'];
  const names = ['Alice Kim', 'Bob Chen', 'Carol Wu', 'Dan Lee', 'Eve Patel',
    'Frank Torres', 'Grace Liu', 'Henry Nakamura', 'Ivy Singh', 'Jack Brown',
    'Kate Davis', 'Leo Garcia', 'Maria Johnson', 'Nick Williams', 'Olivia Martin'];
  return Array.from({ length: count }, (_, i) => ({
    id: `USR-${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@co.io`,
    role: roles[i % roles.length],
  }));
}

function generateTeams(count: number): SimpleTeam[] {
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Support', 'HR', 'Finance'];
  const teamNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf',
    'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar'];
  return Array.from({ length: count }, (_, i) => ({
    id: `TM-${String(i + 1).padStart(4, '0')}`,
    name: `Team ${teamNames[i % teamNames.length]}`,
    members: 3 + (i % 12),
    department: departments[i % departments.length],
  }));
}

export default function T15({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [users] = useState(() => generateUsers(100));
  const [teams] = useState(() => generateTeams(150));

  const [usersPage, setUsersPage] = useState(1);
  const [usersSize, setUsersSize] = useState(10);
  const [teamsPage, setTeamsPage] = useState(1);
  const [teamsSize, setTeamsSize] = useState(10);
  const successFired = useRef(false);

  const usersData = useMemo(() => {
    const s = (usersPage - 1) * usersSize;
    return users.slice(s, s + usersSize);
  }, [users, usersPage, usersSize]);
  const usersTotal = Math.ceil(users.length / usersSize);

  const teamsData = useMemo(() => {
    const s = (teamsPage - 1) * teamsSize;
    return teams.slice(s, s + teamsSize);
  }, [teams, teamsPage, teamsSize]);
  const teamsTotal = Math.ceil(teams.length / teamsSize);

  useEffect(() => {
    if (successFired.current) return;
    if (teamsSize === 20 && teamsPage === 5 && usersSize === 10 && usersPage === 1) {
      successFired.current = true;
      onSuccess();
    }
  }, [teamsSize, teamsPage, usersSize, usersPage, onSuccess]);

  return (
    <div style={{ padding: 16 }}>
      <Card shadow="sm" padding="md" withBorder>
        <Button leftSection={<IconUsers size={16} />} onClick={() => setOpened(true)}>
          Team Manager
        </Button>
      </Card>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Team Manager"
        size="xl" data-testid="team-modal">
        <Text fw={500} mb="xs">Users</Text>
        <Card shadow="sm" padding="sm" withBorder mb="lg" data-testid="users-card">
          <Group justify="flex-end" mb="xs">
            <Select value={String(usersSize)} onChange={(v) => { if (v) { setUsersSize(+v); setUsersPage(1); } }}
              data={['10', '20', '50']} size="xs" w={70} data-testid="users-page-size" />
          </Group>
          <Table striped highlightOnHover data-current-page={usersPage} data-page-size={usersSize}>
            <Table.Thead><Table.Tr>
              <Table.Th>ID</Table.Th><Table.Th>Name</Table.Th><Table.Th>Email</Table.Th><Table.Th>Role</Table.Th>
            </Table.Tr></Table.Thead>
            <Table.Tbody>{usersData.map((u) => (
              <Table.Tr key={u.id}><Table.Td>{u.id}</Table.Td><Table.Td>{u.name}</Table.Td>
                <Table.Td>{u.email}</Table.Td><Table.Td><Badge variant="light" size="sm">{u.role}</Badge></Table.Td></Table.Tr>
            ))}</Table.Tbody>
          </Table>
          <Group justify="center" mt="sm">
            <Pagination total={usersTotal} value={usersPage} onChange={setUsersPage} size="sm" data-testid="users-pagination" />
          </Group>
        </Card>

        <Text fw={500} mb="xs">Teams</Text>
        <Card shadow="sm" padding="sm" withBorder data-testid="teams-card">
          <Group justify="flex-end" mb="xs">
            <Select value={String(teamsSize)} onChange={(v) => { if (v) { setTeamsSize(+v); setTeamsPage(1); } }}
              data={['10', '20', '50']} size="xs" w={70} data-testid="teams-page-size" />
          </Group>
          <Table striped highlightOnHover data-current-page={teamsPage} data-page-size={teamsSize}>
            <Table.Thead><Table.Tr>
              <Table.Th>ID</Table.Th><Table.Th>Team</Table.Th><Table.Th>Members</Table.Th><Table.Th>Department</Table.Th>
            </Table.Tr></Table.Thead>
            <Table.Tbody>{teamsData.map((t) => (
              <Table.Tr key={t.id}><Table.Td>{t.id}</Table.Td><Table.Td>{t.name}</Table.Td>
                <Table.Td>{t.members}</Table.Td><Table.Td><Badge variant="light" size="sm">{t.department}</Badge></Table.Td></Table.Tr>
            ))}</Table.Tbody>
          </Table>
          <Group justify="center" mt="sm">
            <Pagination total={teamsTotal} value={teamsPage} onChange={setTeamsPage} size="sm" data-testid="teams-pagination" />
          </Group>
        </Card>
      </Modal>
    </div>
  );
}
