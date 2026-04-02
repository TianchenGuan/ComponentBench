'use client';

/**
 * menubar-mantine-T07: Horizontal scroll header to reach Integrations (compact, small)
 * 
 * Layout: isolated_card, centered.
 * Spacing: compact. Scale: small.
 * The menubar is a horizontally scrollable header row (implemented with Mantine ScrollArea in the header).
 * - Many header items are present: Overview, Projects, Teams, Analytics, Reports, Billing, Settings, Integrations (target), Help.
 * - Due to limited width and small scale, the header shows only the first few items at load; Integrations starts off-screen to the right.
 * - The menu bar itself scrolls horizontally (not the page).
 * - Initial state: Overview active.
 * 
 * Success: The menubar's active item is "Integrations".
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const menuItems = [
  'Overview', 'Projects', 'Teams', 'Analytics', 'Reports', 
  'Billing', 'Settings', 'Integrations', 'Help'
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Integrations' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 400 }}>
      <Text size="xs" c="dimmed" mb="sm" fw={500}>
        Header menu is scrollable; Integrations is off-screen to the right
      </Text>
      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <ScrollArea type="auto" scrollbarSize={6}>
          <Group gap={4} wrap="nowrap" data-testid="menubar-main" style={{ minWidth: 700 }}>
            {menuItems.map((item) => (
              <UnstyledButton
                key={item}
                onClick={() => setActiveKey(item)}
                aria-current={activeKey === item ? 'page' : undefined}
                data-testid={`menubar-item-${item.toLowerCase()}`}
                style={{
                  padding: '6px 12px',
                  borderRadius: 4,
                  borderBottom: activeKey === item ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                  color: activeKey === item ? 'var(--mantine-color-blue-6)' : 'inherit',
                  fontWeight: activeKey === item ? 600 : 400,
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </UnstyledButton>
            ))}
          </Group>
        </ScrollArea>
      </Paper>
    </Paper>
  );
}
