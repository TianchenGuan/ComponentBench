'use client';

/**
 * menu_button-mantine-T08: Open Help menu on hover
 * 
 * Layout: isolated_card near the top-right of the viewport with dark theme.
 * There is one Mantine Menu whose trigger behavior is set to open on hover
 * (trigger="hover") with an open delay and close delay.
 * 
 * The Menu.Target is a Button labeled "Help".
 * Hovering over the button opens the dropdown showing items:
 * "Docs", "Support", "Keyboard shortcuts".
 * 
 * Initial state: menu closed.
 * Success: The menu is open (dropdown visible).
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (opened && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [opened, successTriggered, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Quick Access</Text>
      
      <Menu
        trigger="hover"
        openDelay={200}
        closeDelay={300}
        opened={opened}
        onChange={setOpened}
      >
        <Menu.Target>
          <Button
            variant="default"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-help"
            aria-expanded={opened}
          >
            Help
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>Docs</Menu.Item>
          <Menu.Item>Support</Menu.Item>
          <Menu.Item>Keyboard shortcuts</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}
