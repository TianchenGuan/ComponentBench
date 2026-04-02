'use client';

/**
 * menu-mantine-T10: Pick the referenced option from the Secondary menu (3 menus on page)
 * 
 * Scene: theme=light, spacing=comfortable, layout=form_section, placement=center, scale=default, instances=3.
 *
 * A "Reference preview" card at the top shows the exact target menu row appearance: a bell icon next to "Notifications".
 *
 * Components:
 * - Three Mantine Menus arranged in a row:
 *   1) Primary menu
 *   2) Secondary menu ← target instance
 *   3) Tertiary menu
 *
 * Menu contents:
 * - Each dropdown contains the same icon+label items:
 *   - Notifications (bell icon) ← target item (exists in all menus)
 *   - Messages (chat icon)
 *   - Calendar (calendar icon)
 *   - Settings (gear icon)
 *
 * Initial state:
 * - All menus are closed.
 * - Under each menu is a status line (all start as None).
 *
 * Success: In the menu labeled "Secondary menu", the selected item matches the Reference preview: "Notifications".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, Group, Box, TextInput } from '@mantine/core';
import { IconChevronDown, IconBell, IconMessage, IconCalendar, IconSettings } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Notifications', icon: <IconBell size={14} /> },
  { key: 'Messages', icon: <IconMessage size={14} /> },
  { key: 'Calendar', icon: <IconCalendar size={14} /> },
  { key: 'Settings', icon: <IconSettings size={14} /> },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [primarySelected, setPrimarySelected] = useState<string | null>(null);
  const [secondarySelected, setSecondarySelected] = useState<string | null>(null);
  const [tertiarySelected, setTertiarySelected] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (secondarySelected === 'Notifications' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [secondarySelected, successTriggered, onSuccess]);

  const renderMenu = (
    label: string,
    selected: string | null,
    setSelected: (value: string) => void,
    testId: string
  ) => (
    <Box style={{ flex: 1 }}>
      <Text size="xs" c="dimmed" fw={500} mb="xs">{label}</Text>
      <Menu shadow="md" width={160}>
        <Menu.Target>
          <Button
            variant="outline"
            size="sm"
            rightSection={<IconChevronDown size={14} />}
            data-testid={`menu-button-${testId}`}
          >
            {label}
          </Button>
        </Menu.Target>
        <Menu.Dropdown data-testid={`menu-${testId}`}>
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              leftSection={item.icon}
              onClick={() => setSelected(item.key)}
              data-testid={`${testId}-item-${item.key.toLowerCase()}`}
            >
              {item.key}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      <Text size="xs" c="dimmed" mt="xs">
        {label.replace(' menu', '')} selected: <strong data-testid={`${testId}-selected`}>{selected || 'None'}</strong>
      </Text>
    </Box>
  );

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 600 }}>
      {/* Reference preview */}
      <Paper withBorder p="md" mb="lg" style={{ background: 'var(--mantine-color-gray-0)' }}>
        <Text size="xs" c="dimmed" fw={500} mb="xs">Reference preview</Text>
        <Group gap="xs">
          <IconBell size={18} />
          <Text size="sm" fw={500}>Notifications</Text>
        </Group>
      </Paper>

      {/* Form section clutter */}
      <Box mb="lg">
        <TextInput label="Page name" value="Dashboard" disabled size="xs" mb="xs" />
        <Text size="xs" c="dimmed">Configure the navigation menus for this page.</Text>
      </Box>

      {/* Three menus */}
      <Group align="flex-start" gap="md">
        {renderMenu('Primary menu', primarySelected, setPrimarySelected, 'primary')}
        {renderMenu('Secondary menu', secondarySelected, setSecondarySelected, 'secondary')}
        {renderMenu('Tertiary menu', tertiarySelected, setTertiarySelected, 'tertiary')}
      </Group>
    </Paper>
  );
}
