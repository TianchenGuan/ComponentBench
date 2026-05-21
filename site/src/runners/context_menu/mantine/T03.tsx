'use client';

/**
 * context_menu-mantine-T03: Toggle Starred on
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a single message row labeled "Message from Jordan" with a short snippet.
 * Right-clicking the row opens a custom context menu.
 *
 * Context menu: onContextMenu opens a Mantine Menu dropdown at cursor position.
 * One item is checkable and shows a check icon when enabled.
 *
 * Menu items: Reply, Mark as read, Starred (checkable).
 *
 * Initial state: Starred is OFF (unchecked).
 *
 * Success: The checked state for 'Starred' is true (ON).
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Group, Box } from '@mantine/core';
import { IconMail, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [starred, setStarred] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (starred && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [starred, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const handleStarredToggle = () => {
    setStarred((prev) => !prev);
    // Keep menu open to show toggle
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 400 }}>
      <Text size="lg" fw={500} mb="md">Messages</Text>
      
      <Menu
        opened={menuOpen}
        onChange={setMenuOpen}
        position="bottom-start"
      >
        <Menu.Target>
          <Group
            onContextMenu={handleContextMenu}
            gap="sm"
            p="md"
            style={{
              background: 'var(--mantine-color-gray-0)',
              borderRadius: 8,
              cursor: 'context-menu',
            }}
            data-testid="message-row"
            data-starred={starred}
          >
            <IconMail size={24} color="var(--mantine-color-blue-6)" />
            <Box style={{ flex: 1 }}>
              <Text size="sm" fw={500}>Message from Jordan</Text>
              <Text size="xs" c="dimmed" lineClamp={1}>
                Hey, I wanted to follow up on our conversation about the project...
              </Text>
            </Box>
            <Text size="xs" c="dimmed">2h ago</Text>
          </Group>
        </Menu.Target>

        <Menu.Dropdown data-testid="context-menu-overlay">
          <Menu.Item onClick={() => setMenuOpen(false)}>Reply</Menu.Item>
          <Menu.Item onClick={() => setMenuOpen(false)}>Mark as read</Menu.Item>
          <Menu.Item 
            onClick={handleStarredToggle}
            leftSection={starred ? <IconCheck size={14} /> : <div style={{ width: 14 }} />}
            data-testid="starred-item"
          >
            Starred
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Text size="xs" c="dimmed" mt="md">
        Starred: <strong data-testid="starred-status">{starred ? 'ON' : 'OFF'}</strong>
      </Text>
    </Paper>
  );
}
