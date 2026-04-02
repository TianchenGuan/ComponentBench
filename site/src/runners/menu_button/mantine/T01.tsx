'use client';

/**
 * menu_button-mantine-T01: Open Actions menu
 * 
 * Layout: isolated_card centered titled "Document".
 * A single Mantine Menu is rendered with Menu.Target wrapping a Button labeled "Actions".
 * Clicking the button opens Menu.Dropdown with three Menu.Item entries:
 * "Rename", "Duplicate", "Delete".
 * 
 * Initial state: menu closed.
 * Success: The Mantine Menu dropdown is open for the "Actions" menu button.
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (opened && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [opened, successTriggered, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Document</Text>
      
      <Menu opened={opened} onChange={setOpened}>
        <Menu.Target>
          <Button
            variant="default"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-actions"
            aria-expanded={opened}
          >
            Actions
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>Rename</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Item>Delete</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}
