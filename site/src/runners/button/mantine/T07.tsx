'use client';

/**
 * button-mantine-T07: Open More menu via ActionIcon (compact dashboard)
 * 
 * Dashboard header with two ActionIcons: Refresh and More (three dots).
 * Task: Click the More ActionIcon to open its Menu.
 */

import React, { useState } from 'react';
import { ActionIcon, Menu, Tooltip, Paper, Group, Text } from '@mantine/core';
import { IconRefresh, IconDotsVertical } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [menuOpened, setMenuOpened] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpened(true);
    onSuccess();
  };

  return (
    <Paper shadow="sm" p="sm" radius="md" withBorder>
      <Group justify="space-between">
        <Text fw={500}>Dashboard</Text>
        <Group gap="xs">
          <Tooltip label="Refresh">
            <ActionIcon variant="subtle" size="sm" data-testid="mantine-actionicon-refresh">
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
          <Menu
            opened={menuOpened}
            onChange={setMenuOpened}
            position="bottom-end"
          >
            <Menu.Target>
              <Tooltip label="More options">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={handleMenuOpen}
                  data-testid="mantine-actionicon-more"
                >
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown data-overlay-id="mantine-menu-more">
              <Menu.Item>Export</Menu.Item>
              <Menu.Item>Print</Menu.Item>
              <Menu.Divider />
              <Menu.Item>Settings</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  );
}
