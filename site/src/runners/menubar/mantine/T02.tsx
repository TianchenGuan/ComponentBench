'use client';

/**
 * menubar-mantine-T02: Help → Documentation
 * 
 * Layout: isolated_card, centered.
 * The header uses Mantine primitives: a Group of targets, including a Menu labeled "Help".
 * - Clicking the Help target opens a Mantine Menu dropdown beneath it.
 * - Dropdown items: Documentation (target), Keyboard shortcuts, Contact support.
 * - Initial state: no dropdown open; Overview is active.
 * - Selecting an item closes the dropdown and records the selected_path (Help → <item>).
 * 
 * Success: The selected menu path is Help → Documentation.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, Menu, Button } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      selectedPath.length === 2 &&
      selectedPath[0] === 'Help' &&
      selectedPath[1] === 'Documentation' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleMenuItemClick = (item: string) => {
    setSelectedPath(['Help', item]);
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 500 }}>
      <Text size="xs" c="dimmed" mb="sm" fw={500}>
        Help menu items: Documentation, Keyboard shortcuts, Contact support
      </Text>
      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <Group gap="xs" data-testid="menubar-main">
          {['Overview', 'Projects', 'Settings'].map((item) => (
            <UnstyledButton
              key={item}
              onClick={() => setActiveKey(item)}
              aria-current={activeKey === item ? 'page' : undefined}
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                borderBottom: activeKey === item ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                color: activeKey === item ? 'var(--mantine-color-blue-6)' : 'inherit',
              }}
            >
              {item}
            </UnstyledButton>
          ))}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
                data-testid="menubar-item-help"
              >
                Help
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid="menu-help">
              <Menu.Item onClick={() => handleMenuItemClick('Documentation')} data-testid="menu-item-documentation">
                Documentation
              </Menu.Item>
              <Menu.Item onClick={() => handleMenuItemClick('Keyboard shortcuts')} data-testid="menu-item-shortcuts">
                Keyboard shortcuts
              </Menu.Item>
              <Menu.Item onClick={() => handleMenuItemClick('Contact support')} data-testid="menu-item-contact">
                Contact support
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>
    </Paper>
  );
}
