'use client';

/**
 * search_input-mantine-T04: Settings panel: type into the Users search (2 instances)
 *
 * Isolated card centered in the viewport titled "Directory search".
 * Compact spacing is enabled: tighter vertical padding and smaller gaps between elements.
 * There are TWO Mantine TextInput search fields stacked closely:
 *   • Label "Users" with placeholder "Search users…"
 *   • Label "Teams" with placeholder "Search teams…"
 * Both have a left search icon and default width.
 * Initial state: both empty. Each filters a small list below live as you type (no Enter required).
 * No other interactive elements (clutter: none).
 *
 * Success: The TextInput instance labeled "Users" has value "maria".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TextInput, Text, List, Stack } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const users = ['Alice', 'Bob', 'Maria', 'David', 'Emma'];
const teams = ['Engineering', 'Marketing', 'Sales', 'Design'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [usersValue, setUsersValue] = useState('');
  const [teamsValue, setTeamsValue] = useState('');
  const hasSucceeded = useRef(false);

  const filteredUsers = users.filter(u =>
    u.toLowerCase().includes(usersValue.toLowerCase())
  );
  const filteredTeams = teams.filter(t =>
    t.toLowerCase().includes(teamsValue.toLowerCase())
  );

  useEffect(() => {
    if (usersValue === 'maria' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [usersValue, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="md" mb="xs">Directory search</Text>
      <Stack gap="xs">
        <div>
          <TextInput
            label="Users"
            placeholder="Search users…"
            value={usersValue}
            onChange={(e) => setUsersValue(e.target.value)}
            leftSection={<IconSearch size={14} />}
            size="sm"
            data-testid="search-users"
          />
          <List size="xs" mt={4}>
            {filteredUsers.map((user, index) => (
              <List.Item key={index}>{user}</List.Item>
            ))}
          </List>
        </div>

        <div>
          <TextInput
            label="Teams"
            placeholder="Search teams…"
            value={teamsValue}
            onChange={(e) => setTeamsValue(e.target.value)}
            leftSection={<IconSearch size={14} />}
            size="sm"
            data-testid="search-teams"
          />
          <List size="xs" mt={4}>
            {filteredTeams.map((team, index) => (
              <List.Item key={index}>{team}</List.Item>
            ))}
          </List>
        </div>
      </Stack>
    </Card>
  );
}
