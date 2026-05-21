'use client';

/**
 * menubar-mantine-T03: Turn ON View → Show sidebar
 * 
 * Layout: isolated_card, centered.
 * Header menubar includes Menu targets: View, Help, and a few direct links.
 * - Clicking "View" opens a Mantine Menu dropdown with three checkable items:
 *     • Show sidebar (initially OFF)  ← target
 *     • Compact list (initially ON)
 *     • Show status bar (initially OFF)
 * - Each item displays a check indicator when enabled.
 * - Initial state: dropdown closed; some unrelated header link is active.
 * - No other clutter.
 * 
 * Success: The toggle state for "Show sidebar" is ON.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, Menu, Button } from '@mantine/core';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToggleStates {
  'Show sidebar': boolean;
  'Compact list': boolean;
  'Show status bar': boolean;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleStates>({
    'Show sidebar': false,
    'Compact list': true,
    'Show status bar': false,
  });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (toggles['Show sidebar'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [toggles, successTriggered, onSuccess]);

  const handleToggle = (key: keyof ToggleStates) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 500 }}>
      <Text size="xs" c="dimmed" mb="sm" fw={500}>
        View menu: Show sidebar [OFF], Compact list [ON], Show status bar [OFF]
      </Text>
      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <Group gap="xs" data-testid="menubar-main">
          <UnstyledButton
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              borderBottom: '2px solid var(--mantine-color-blue-6)',
              color: 'var(--mantine-color-blue-6)',
            }}
          >
            Dashboard
          </UnstyledButton>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
                data-testid="menubar-item-view"
              >
                View
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid="menu-view">
              {(Object.keys(toggles) as Array<keyof ToggleStates>).map((key) => (
                <Menu.Item
                  key={key}
                  onClick={() => handleToggle(key)}
                  leftSection={toggles[key] ? <IconCheck size={16} /> : <span style={{ width: 16 }} />}
                  data-testid={`menu-item-${key.toLowerCase().replace(/ /g, '-')}`}
                >
                  {key}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" rightSection={<IconChevronDown size={16} />}>
                Help
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Documentation</Menu.Item>
              <Menu.Item>About</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>
    </Paper>
  );
}
