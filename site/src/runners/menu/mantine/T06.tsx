'use client';

/**
 * menu-mantine-T06: Select System from a hover-triggered menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=settings_panel, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A Mantine Menu configured with trigger="hover" and a small openDelay/closeDelay.
 * - The Menu.Target is a button labeled "Theme".
 *
 * Initial state:
 * - The dropdown is closed.
 * - Current theme text reads "Theme: Light".
 *
 * Menu items:
 * - Light
 * - Dark
 * - System ← target
 *
 * Success: The committed theme value shown on the page is "System".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, TextInput, Box } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const themeOptions = ['Light', 'Dark', 'System'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>('Light');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedTheme === 'System' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedTheme, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 400 }}>
      <Text size="lg" fw={500} mb="md">Appearance Settings</Text>

      {/* Settings panel clutter */}
      <Box mb="md">
        <TextInput label="Display name" value="User" disabled mb="xs" />
        <TextInput label="Timezone" value="UTC-5 (Eastern)" disabled />
      </Box>

      <Text size="xs" c="dimmed" fw={500} mb="xs">Theme preference</Text>
      
      <Menu
        shadow="md"
        width={150}
        trigger="hover"
        openDelay={100}
        closeDelay={200}
      >
        <Menu.Target>
          <Button
            variant="outline"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-theme"
          >
            Theme
          </Button>
        </Menu.Target>

        <Menu.Dropdown data-testid="menu-theme">
          {themeOptions.map((option) => (
            <Menu.Item
              key={option}
              onClick={() => setSelectedTheme(option)}
              data-testid={`menu-item-${option.toLowerCase()}`}
            >
              {option}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Text size="sm" c="dimmed" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        Theme: <strong data-testid="selected-theme">{selectedTheme}</strong>
      </Text>
    </Paper>
  );
}
