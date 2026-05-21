'use client';

/**
 * menubar-mantine-T10: Admin → API keys (dark dashboard, high clutter)
 * 
 * Layout: dashboard with a sticky header.
 * Theme: light.
 * The top header is built with Mantine AppShell.Header. It contains:
 * - Left: app logo and a few header links (Overview, Reports).
 * - Center: a search input (distractor).
 * - Right: an "Admin" Menu target (dropdown) next to a user avatar menu and notification button (distractors).
 * Admin dropdown items: Users, Permissions, API keys (target), Audit log.
 * - Initial state: Overview active; no dropdown open.
 * - Clutter (high): multiple clickable controls in the header (search input, avatar menu, notifications) plus dashboard widgets below.
 * 
 * Success: The selected menu path is Admin → API keys.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, Menu, Button, TextInput, ActionIcon, Avatar, Card, SimpleGrid, Box } from '@mantine/core';
import { IconChevronDown, IconSearch, IconBell } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      selectedPath.length === 2 &&
      selectedPath[0] === 'Admin' &&
      selectedPath[1] === 'API keys' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleAdminItemClick = (item: string) => {
    setSelectedPath(['Admin', item]);
  };

  return (
    <Paper shadow="sm" radius="md" style={{ width: 700 }}>
      <Text size="xs" c="dimmed" p="md" pb={0} fw={500}>
        Admin menu items: Users, Permissions, API keys, Audit log
      </Text>
      
      {/* Header with clutter */}
      <Paper withBorder m="md" mb={0} p="xs" radius="sm" bg="gray.0">
        <Group justify="space-between" data-testid="menubar-main">
          {/* Left: Logo and links */}
          <Group gap="xs">
            <Text fw={700} c="blue" mr="md">AppLogo</Text>
            {['Overview', 'Reports'].map((item) => (
              <UnstyledButton
                key={item}
                onClick={() => setActiveKey(item)}
                aria-current={activeKey === item ? 'page' : undefined}
                style={{
                  padding: '8px 16px',
                  borderRadius: 4,
                  borderBottom: activeKey === item ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                  color: activeKey === item ? 'var(--mantine-color-blue-6)' : 'inherit',
                }}
              >
                {item}
              </UnstyledButton>
            ))}
          </Group>

          {/* Center: Search (distractor) */}
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            style={{ width: 200 }}
            data-testid="search-input"
          />

          {/* Right: Admin menu and distractors */}
          <Group gap="xs">
            <Menu shadow="md" width={180}>
              <Menu.Target>
                <Button
                  variant="subtle"
                  rightSection={<IconChevronDown size={16} />}
                  data-testid="menubar-item-admin"
                >
                  Admin
                </Button>
              </Menu.Target>
              <Menu.Dropdown data-testid="menu-admin">
                <Menu.Item onClick={() => handleAdminItemClick('Users')}>Users</Menu.Item>
                <Menu.Item onClick={() => handleAdminItemClick('Permissions')}>Permissions</Menu.Item>
                <Menu.Item onClick={() => handleAdminItemClick('API keys')} data-testid="menu-item-api-keys">
                  API keys
                </Menu.Item>
                <Menu.Item onClick={() => handleAdminItemClick('Audit log')}>Audit log</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            
            {/* Notification button (distractor) */}
            <ActionIcon variant="subtle" data-testid="notifications-button">
              <IconBell size={18} />
            </ActionIcon>
            
            {/* Avatar menu (distractor) */}
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <ActionIcon variant="subtle" radius="xl" size="lg" data-testid="avatar-button">
                  <Avatar size="sm" radius="xl">JD</Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>Profile</Menu.Item>
                <Menu.Item>Sign out</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Paper>

      {/* Dashboard clutter */}
      <Box p="md" bg="gray.1">
        <SimpleGrid cols={3} spacing="sm">
          <Card shadow="xs" p="sm">
            <Text size="xs" c="dimmed">Total Users</Text>
            <Text size="xl" fw={600}>1,234</Text>
          </Card>
          <Card shadow="xs" p="sm">
            <Text size="xs" c="dimmed">API Calls</Text>
            <Text size="xl" fw={600}>45.2K</Text>
          </Card>
          <Card shadow="xs" p="sm">
            <Text size="xs" c="dimmed">Revenue</Text>
            <Text size="xl" fw={600}>$12.5K</Text>
          </Card>
        </SimpleGrid>
      </Box>
    </Paper>
  );
}
