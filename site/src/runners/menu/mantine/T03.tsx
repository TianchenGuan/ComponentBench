'use client';

/**
 * menu-mantine-T03: Enable Compact view via a checkable menu item
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A Mantine Menu with a small trigger button labeled "View".
 * - Menu items behave as independent toggles and show a check indicator when enabled.
 *
 * Initial state:
 * - Compact view: OFF (unchecked) ← target
 * - Show gridlines: ON (checked)
 * - Show totals: OFF (unchecked)
 *
 * Success: The "Compact view" toggle is ON.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToggleState {
  'Compact view': boolean;
  'Show gridlines': boolean;
  'Show totals': boolean;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleState>({
    'Compact view': false,
    'Show gridlines': true,
    'Show totals': false,
  });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (toggles['Compact view'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [toggles, successTriggered, onSuccess]);

  const handleToggle = (key: keyof ToggleState) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 350 }}>
      <Text size="lg" fw={500} mb="md">Table Settings</Text>
      
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            variant="outline"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-view"
          >
            View
          </Button>
        </Menu.Target>

        <Menu.Dropdown data-testid="menu-view">
          {(Object.keys(toggles) as Array<keyof ToggleState>).map((key) => (
            <Menu.Item
              key={key}
              leftSection={toggles[key] ? <IconCheck size={14} color="green" /> : <span style={{ width: 14 }} />}
              onClick={() => handleToggle(key)}
              data-testid={`menu-item-${key.toLowerCase().replace(/ /g, '-')}`}
              data-checked={toggles[key]}
            >
              {key}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Text size="sm" c="dimmed" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        Compact view: <strong data-testid="compact-view-status">{toggles['Compact view'] ? 'On' : 'Off'}</strong>
      </Text>
    </Paper>
  );
}
