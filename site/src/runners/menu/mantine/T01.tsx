'use client';

/**
 * menu-mantine-T01: Open Actions menu and choose Download
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A Mantine Menu component with a Button as Menu.Target labeled "Actions".
 * - The dropdown (Menu.Dropdown) contains a short list of Menu.Item actions.
 *
 * Initial state:
 * - The menu is closed.
 * - A text label below reads "Last action: None".
 *
 * Menu items:
 * - Download ← target
 * - Duplicate
 * - Archive
 *
 * Success: The last selected action from the Actions menu is "Download".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, Group } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastAction === 'Download' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastAction, successTriggered, onSuccess]);

  const handleSelect = (action: string) => {
    setLastAction(action);
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 350 }}>
      <Text size="lg" fw={500} mb="md">Account</Text>
      
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-actions"
          >
            Actions
          </Button>
        </Menu.Target>

        <Menu.Dropdown data-testid="menu-actions">
          <Menu.Item onClick={() => handleSelect('Download')} data-testid="menu-item-download">
            Download
          </Menu.Item>
          <Menu.Item onClick={() => handleSelect('Duplicate')} data-testid="menu-item-duplicate">
            Duplicate
          </Menu.Item>
          <Menu.Item onClick={() => handleSelect('Archive')} data-testid="menu-item-archive">
            Archive
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Text size="sm" c="dimmed" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        Last action: <strong data-testid="last-action">{lastAction || 'None'}</strong>
      </Text>
    </Paper>
  );
}
