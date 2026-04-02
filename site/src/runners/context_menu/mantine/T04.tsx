'use client';

/**
 * context_menu-mantine-T04: Folder B: create New file
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=2.
 *
 * Instances: TWO folder rows are shown, both support a context menu on right-click:
 * - Folder A
 * - Folder B
 *
 * Target instance: Folder B.
 *
 * Context menu: onContextMenu opens a Mantine Menu dropdown at the cursor.
 *
 * Menu items: New file, New folder, Rename.
 *
 * Success: The activated item path equals ['New file'] on the context menu instance labeled 'Folder B'.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Group, Box } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface FolderRowProps {
  name: string;
  onMenuClick: (item: string) => void;
  lastActivated: string | null;
}

function FolderRow({ name, onMenuClick, lastActivated }: FolderRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const handleItemClick = (item: string) => {
    onMenuClick(item);
    setMenuOpen(false);
  };

  return (
    <Menu
      opened={menuOpen}
      onChange={setMenuOpen}
      position="bottom-start"
    >
      <Menu.Target>
        <Group
          onContextMenu={handleContextMenu}
          gap="sm"
          p="sm"
          mb="xs"
          style={{
            background: 'var(--mantine-color-gray-0)',
            borderRadius: 8,
            cursor: 'context-menu',
          }}
          data-testid={`folder-${name.toLowerCase().replace(' ', '-')}`}
          data-last-activated={lastActivated}
        >
          <IconFolder size={24} color="var(--mantine-color-yellow-6)" />
          <Text size="sm" fw={500}>{name}</Text>
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => handleItemClick('New file')}>New file</Menu.Item>
        <Menu.Item onClick={() => handleItemClick('New folder')}>New folder</Menu.Item>
        <Menu.Item onClick={() => handleItemClick('Rename')}>Rename</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [folderALastActivated, setFolderALastActivated] = useState<string | null>(null);
  const [folderBLastActivated, setFolderBLastActivated] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (folderBLastActivated === 'New file' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [folderBLastActivated, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 350 }}>
      <Text size="lg" fw={500} mb="md">Folders</Text>
      
      <FolderRow
        name="Folder A"
        onMenuClick={(item) => setFolderALastActivated(item)}
        lastActivated={folderALastActivated}
      />
      <FolderRow
        name="Folder B"
        onMenuClick={(item) => setFolderBLastActivated(item)}
        lastActivated={folderBLastActivated}
      />

      <Box mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Text size="xs" c="dimmed">
          Folder A last action: <strong data-testid="folder-a-last-action">{folderALastActivated || 'None'}</strong>
        </Text>
        <Text size="xs" c="dimmed">
          Folder B last action: <strong data-testid="folder-b-last-action">{folderBLastActivated || 'None'}</strong>
        </Text>
      </Box>
    </Paper>
  );
}
