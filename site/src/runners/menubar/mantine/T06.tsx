'use client';

/**
 * menubar-mantine-T06: Match bell icon menu (Alerts) at bottom-left
 * 
 * Layout: isolated_card positioned in the bottom-left of the viewport (placement=bottom_left).
 * The card shows a Mantine-styled header row with icon+label items:
 * - Inbox (mail icon)
 * - Alerts (bell icon)   ← target
 * - Tasks (checklist icon)
 * - Settings (gear icon)
 * Above the header is a small "Target icon" chip showing the bell icon.
 * - Initial state: Inbox is active.
 * - Clicking an item sets it active (underline + aria-current).
 * - No dropdown menus.
 * 
 * Success: The menubar's active item is "Alerts".
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, Box } from '@mantine/core';
import { IconMail, IconBell, IconChecklist, IconSettings } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Inbox', label: 'Inbox', icon: IconMail },
  { key: 'Alerts', label: 'Alerts', icon: IconBell },
  { key: 'Tasks', label: 'Tasks', icon: IconChecklist },
  { key: 'Settings', label: 'Settings', icon: IconSettings },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Inbox');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Alerts' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 500 }}>
      {/* Target icon reference */}
      <Group gap="xs" mb="md" align="center">
        <Text size="xs" c="dimmed">Target icon:</Text>
        <Box
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            background: 'var(--mantine-color-blue-0)',
            borderRadius: 4,
            border: '1px solid var(--mantine-color-blue-3)',
          }}
          data-testid="target-icon"
        >
          <IconBell size={18} color="var(--mantine-color-blue-6)" />
        </Box>
        <Text size="xs" c="dimmed">
          Click Alerts (🔔) in the header menu bar.
        </Text>
      </Group>

      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <Group gap="xs" data-testid="menubar-main">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <UnstyledButton
                key={item.key}
                onClick={() => setActiveKey(item.key)}
                aria-current={activeKey === item.key ? 'page' : undefined}
                data-testid={`menubar-item-${item.key.toLowerCase()}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 4,
                  borderBottom: activeKey === item.key ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                  color: activeKey === item.key ? 'var(--mantine-color-blue-6)' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icon size={16} />
                {item.label}
              </UnstyledButton>
            );
          })}
        </Group>
      </Paper>
    </Paper>
  );
}
