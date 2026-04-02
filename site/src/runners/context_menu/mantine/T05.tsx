'use client';

/**
 * context_menu-mantine-T05: Share → Copy public link (icon reference)
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=mixed.
 *
 * Target element: a single file row labeled "Press kit.zip". Right-clicking opens a custom context menu.
 *
 * Guidance element: a non-interactive "Reference" box above the file row shows a globe icon
 * and the text "Copy public link".
 *
 * Context menu: composed from Mantine Menu components. The menu supports a submenu "Share"
 * that opens to the right.
 *
 * Menu structure (with icons):
 * - Open
 * - Share ▸
 *     - Copy public link (globe icon)
 *     - Copy private link (lock icon)
 *     - Email… (envelope icon)
 * - Rename
 *
 * Success: The activated item path equals ['Share','Copy public link'] for the Press kit.zip context menu.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Group, Badge } from '@mantine/core';
import { IconFile, IconWorld, IconLock, IconMail, IconChevronRight } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastActivatedPath, setLastActivatedPath] = useState<string[] | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      lastActivatedPath &&
      lastActivatedPath.length === 2 &&
      lastActivatedPath[0] === 'Share' &&
      lastActivatedPath[1] === 'Copy public link' &&
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
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 400 }}>
      <Text size="lg" fw={500} mb="md">Files</Text>

      {/* Reference box */}
      <Badge
        leftSection={<IconWorld size={12} />}
        variant="light"
        color="blue"
        mb="md"
        data-testid="reference-box"
      >
        Reference: Copy public link
      </Badge>
      
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
            data-testid="file-row"
            data-last-activated-path={lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
          >
            <IconFile size={24} color="var(--mantine-color-orange-6)" />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>Press kit.zip</Text>
              <Text size="xs" c="dimmed">4.2 MB • Updated 3 days ago</Text>
            </div>
          </Group>
        </Menu.Target>

        <Menu.Dropdown data-testid="context-menu-overlay">
          <Menu.Item onClick={() => handleItemClick(['Open'])}>Open</Menu.Item>
          <Menu
            trigger="hover"
            position="right-start"
            offset={0}
          >
            <Menu.Target>
              <Menu.Item rightSection={<IconChevronRight size={14} />}>
                Share
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<IconWorld size={14} />}
                onClick={() => handleItemClick(['Share', 'Copy public link'])}
              >
                Copy public link
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconLock size={14} />}
                onClick={() => handleItemClick(['Share', 'Copy private link'])}
              >
                Copy private link
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconMail size={14} />}
                onClick={() => handleItemClick(['Share', 'Email…'])}
              >
                Email…
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu.Item onClick={() => handleItemClick(['Rename'])}>Rename</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Text size="xs" c="dimmed" mt="md">
        Last action path: <strong data-testid="last-action-path">{lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}</strong>
      </Text>
    </Paper>
  );
}
