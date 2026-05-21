'use client';

/**
 * menubar-mantine-T04: Open Projects menu (leave dropdown open)
 * 
 * Layout: isolated_card, centered.
 * The menubar is a Mantine AppShell.Header-like row containing a Menu labeled "Projects".
 * - Clicking "Projects" opens a Mantine Menu dropdown.
 * - Items: All projects, Starred, Archived.
 * - Initial state: dropdown closed; Overview link active.
 * - No additional clutter.
 * 
 * Success: The Projects dropdown is open/visible (open_path includes "Projects").
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, Menu, Button } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (isProjectsOpen && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [isProjectsOpen, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 450 }}>
      <Text size="xs" c="dimmed" mb="sm" fw={500}>
        Projects menu dropdown should be open (items: All projects, Starred, Archived)
      </Text>
      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <Group gap="xs" data-testid="menubar-main">
          <UnstyledButton
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              borderBottom: '2px solid var(--mantine-color-blue-6)',
              color: 'var(--mantine-color-blue-6)',
            }}
          >
            Overview
          </UnstyledButton>
          <Menu 
            shadow="md" 
            width={200}
            opened={isProjectsOpen}
            onChange={setIsProjectsOpen}
          >
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
                data-testid="menubar-item-projects"
              >
                Projects
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid="menu-projects">
              <Menu.Item data-testid="menu-item-all">All projects</Menu.Item>
              <Menu.Item data-testid="menu-item-starred">Starred</Menu.Item>
              <Menu.Item data-testid="menu-item-archived">Archived</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <UnstyledButton style={{ padding: '8px 16px', borderRadius: 4 }}>
            Settings
          </UnstyledButton>
        </Group>
      </Paper>
    </Paper>
  );
}
