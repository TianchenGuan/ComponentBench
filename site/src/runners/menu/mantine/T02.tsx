'use client';

/**
 * menu-mantine-T02: Select Rename from an already open menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A Mantine Menu component rendered with its dropdown already open (opened=true).
 * - A small label above the dropdown reads "Item menu".
 *
 * Menu items:
 * - Rename ← target
 * - Move
 * - Delete
 *
 * Initial state:
 * - No item is selected.
 * - A status line under the menu reads "Selected item: None".
 *
 * Success: The selected menu item is "Rename".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedItem === 'Rename' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedItem, successTriggered, onSuccess]);

  const handleSelect = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 300 }}>
      <Text size="xs" c="dimmed" fw={500} mb="xs">
        Item menu
      </Text>
      
      <Menu shadow="md" width={200} opened>
        <Menu.Target>
          <Box style={{ height: 0, overflow: 'hidden' }} />
        </Menu.Target>

        <Menu.Dropdown data-testid="menu-item-actions">
          <Menu.Item onClick={() => handleSelect('Rename')} data-testid="menu-item-rename">
            Rename
          </Menu.Item>
          <Menu.Item onClick={() => handleSelect('Move')} data-testid="menu-item-move">
            Move
          </Menu.Item>
          <Menu.Item onClick={() => handleSelect('Delete')} color="red" data-testid="menu-item-delete">
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Text size="sm" c="dimmed" mt={100} pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        Selected item: <strong data-testid="selected-item">{selectedItem || 'None'}</strong>
      </Text>
    </Paper>
  );
}
