'use client';

/**
 * menu-mantine-T04: Use the Folder actions menu to choose Move to…
 * 
 * Scene: theme=light, spacing=comfortable, layout=form_section, placement=center, scale=default, instances=2.
 *
 * Components:
 * - Two Mantine Menus placed side-by-side:
 *   - "File actions" (left)
 *   - "Folder actions" (right)
 *
 * Menu contents (both are similar to increase disambiguation):
 * - Open
 * - Rename
 * - Move to… ← target item exists in both menus
 * - Delete
 *
 * Initial state:
 * - Both menus are closed.
 * - Under each menu is a status line.
 *
 * Success: The last action recorded for the "Folder actions" menu equals "Move to…".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, Group, TextInput, Box } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const menuItems = ['Open', 'Rename', 'Move to…', 'Delete'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [fileAction, setFileAction] = useState<string | null>(null);
  const [folderAction, setFolderAction] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (folderAction === 'Move to…' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [folderAction, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 500 }}>
      {/* Form section clutter */}
      <Box mb="md">
        <TextInput label="Name" value="Project Documentation" disabled mb="xs" />
        <TextInput label="Path" value="/workspace/docs" disabled mb="xs" />
        <TextInput label="Owner" value="admin@example.com" disabled />
      </Box>

      <Group gap="md" align="flex-start">
        {/* File actions menu */}
        <Box style={{ flex: 1 }}>
          <Text size="xs" c="dimmed" fw={500} mb="xs">File actions</Text>
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <Button
                variant="outline"
                size="sm"
                rightSection={<IconChevronDown size={14} />}
                data-testid="menu-button-file-actions"
              >
                File actions
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid="menu-file-actions">
              {menuItems.map((item) => (
                <Menu.Item
                  key={item}
                  onClick={() => setFileAction(item)}
                  color={item === 'Delete' ? 'red' : undefined}
                >
                  {item}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Text size="xs" c="dimmed" mt="xs">
            File last action: <strong data-testid="file-last-action">{fileAction || 'None'}</strong>
          </Text>
        </Box>

        {/* Folder actions menu */}
        <Box style={{ flex: 1 }}>
          <Text size="xs" c="dimmed" fw={500} mb="xs">Folder actions</Text>
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <Button
                variant="outline"
                size="sm"
                rightSection={<IconChevronDown size={14} />}
                data-testid="menu-button-folder-actions"
              >
                Folder actions
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid="menu-folder-actions">
              {menuItems.map((item) => (
                <Menu.Item
                  key={item}
                  onClick={() => setFolderAction(item)}
                  color={item === 'Delete' ? 'red' : undefined}
                >
                  {item}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Text size="xs" c="dimmed" mt="xs">
            Folder last action: <strong data-testid="folder-last-action">{folderAction || 'None'}</strong>
          </Text>
        </Box>
      </Group>
    </Paper>
  );
}
