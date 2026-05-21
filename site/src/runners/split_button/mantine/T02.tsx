'use client';

/**
 * split_button-mantine-T02: Send: open Mantine split-button menu
 *
 * Layout: isolated card titled "Message" centered in the viewport.
 * Target component: Mantine split button pattern.
 *
 * Menu items: "Send now", "Schedule send…", "Send test", "Save draft"
 * Initial state: Menu closed (menuOpen=false).
 *
 * Success: Menu overlay is open (menuOpen=true)
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const handleOpenChange = (opened: boolean) => {
    setMenuOpen(opened);
    if (opened && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Message</Text>

      {/* Static helper caption */}
      <Text size="sm" c="dimmed" mb="md">
        Choose how to send your message
      </Text>

      <div
        data-testid="split-button-root"
        data-menu-open={menuOpen}
      >
        <Group gap={0}>
          <Button style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
            Send
          </Button>
          <Menu 
            position="bottom-end" 
            opened={menuOpen}
            onChange={handleOpenChange}
          >
            <Menu.Target>
              <Button 
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 8, paddingRight: 8 }}
                aria-expanded={menuOpen}
              >
                <IconChevronDown size={16} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Send now</Menu.Item>
              <Menu.Item>Schedule send…</Menu.Item>
              <Menu.Item>Send test</Menu.Item>
              <Menu.Item>Save draft</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Card>
  );
}
