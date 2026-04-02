'use client';

/**
 * context_menu-mantine-T09: Small: Sort → By date → Newest first
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=bottom_left, scale=small, instances=1.
 *
 * Layout: isolated_card anchored to the BOTTOM-LEFT of the viewport.
 * Scale is SMALL (reduced font size and padding).
 *
 * Target element: a list row labeled "Playlist item 12". Right-clicking on the row opens
 * a custom context menu.
 *
 * Context menu: composed from Mantine Menu components and positioned at cursor coordinates.
 * It includes two nested submenu levels.
 *
 * Menu structure:
 * - Play
 * - Add to queue
 * - Sort ▸
 *     - By title
 *     - By date ▸
 *         - Newest first
 *         - Oldest first
 *     - By duration
 *
 * Success: The activated item path equals ['Sort','By date','Newest first'].
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Group, Box } from '@mantine/core';
import { IconPlaylist, IconChevronRight } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastActivatedPath, setLastActivatedPath] = useState<string[] | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      lastActivatedPath &&
      lastActivatedPath.length === 3 &&
      lastActivatedPath[0] === 'Sort' &&
      lastActivatedPath[1] === 'By date' &&
      lastActivatedPath[2] === 'Newest first' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedPath, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const handleItemClick = (path: string[]) => {
    setLastActivatedPath(path);
    setMenuOpen(false);
  };

  return (
    <Paper shadow="sm" p="sm" radius="md" style={{ width: 280 }}>
      <Text size="sm" fw={500} mb="xs">Playlist</Text>
      
      <Menu
        opened={menuOpen}
        onChange={setMenuOpen}
        position="bottom-start"
      >
        <Menu.Target>
          <Group
            onContextMenu={handleContextMenu}
            gap="xs"
            p="xs"
            style={{
              background: 'var(--mantine-color-gray-0)',
              borderRadius: 6,
              cursor: 'context-menu',
              fontSize: 12,
            }}
            data-testid="playlist-item"
            data-last-activated-path={lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
          >
            <IconPlaylist size={18} color="var(--mantine-color-violet-5)" />
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>Playlist item 12</Text>
              <Text size="xs" c="dimmed">3:42</Text>
            </Box>
          </Group>
        </Menu.Target>

        <Menu.Dropdown style={{ fontSize: 12 }} data-testid="context-menu-overlay">
          <Menu.Item onClick={() => handleItemClick(['Play'])} style={{ fontSize: 12 }}>Play</Menu.Item>
          <Menu.Item onClick={() => handleItemClick(['Add to queue'])} style={{ fontSize: 12 }}>Add to queue</Menu.Item>
          <Menu.Divider />
          <Menu
            trigger="hover"
            position="right-start"
            offset={0}
          >
            <Menu.Target>
              <Menu.Item rightSection={<IconChevronRight size={12} />} style={{ fontSize: 12 }}>
                Sort
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown style={{ fontSize: 12 }} data-testid="sort-submenu">
              <Menu.Item onClick={() => handleItemClick(['Sort', 'By title'])} style={{ fontSize: 12 }}>By title</Menu.Item>
              <Menu
                trigger="hover"
                position="right-start"
                offset={0}
              >
                <Menu.Target>
                  <Menu.Item rightSection={<IconChevronRight size={12} />} style={{ fontSize: 12 }}>
                    By date
                  </Menu.Item>
                </Menu.Target>
                <Menu.Dropdown style={{ fontSize: 12 }} data-testid="by-date-submenu">
                  <Menu.Item onClick={() => handleItemClick(['Sort', 'By date', 'Newest first'])} style={{ fontSize: 12 }}>
                    Newest first
                  </Menu.Item>
                  <Menu.Item onClick={() => handleItemClick(['Sort', 'By date', 'Oldest first'])} style={{ fontSize: 12 }}>
                    Oldest first
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu.Item onClick={() => handleItemClick(['Sort', 'By duration'])} style={{ fontSize: 12 }}>By duration</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Menu.Dropdown>
      </Menu>

      <Text size="xs" c="dimmed" mt="xs" style={{ fontSize: 10 }}>
        Last action: <strong data-testid="last-action-path">{lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}</strong>
      </Text>
    </Paper>
  );
}
