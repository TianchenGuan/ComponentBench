'use client';

/**
 * menubar-mantine-T01: Activate Overview (header links)
 * 
 * Layout: isolated_card, centered.
 * A Mantine AppShell-like header is rendered inside a card. The menubar is a Group of clickable header links:
 * Overview, Activity, Settings, Help.
 * - Clicking a link sets it active (underline + aria-current on the active link).
 * - Initial state: Activity is active (so Overview is not already selected).
 * - No dropdown menus; no clutter.
 * 
 * Success: The menubar's active item is "Overview".
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const menuItems = ['Overview', 'Activity', 'Settings', 'Help'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Activity');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Overview' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 450 }}>
      <Text size="xs" c="dimmed" mb="sm" fw={500}>
        Top menu bar: Overview · Activity · Settings · Help
      </Text>
      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <Group gap="xs" data-testid="menubar-main">
          {menuItems.map((item) => (
            <UnstyledButton
              key={item}
              onClick={() => setActiveKey(item)}
              aria-current={activeKey === item ? 'page' : undefined}
              data-testid={`menubar-item-${item.toLowerCase()}`}
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                borderBottom: activeKey === item ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                color: activeKey === item ? 'var(--mantine-color-blue-6)' : 'inherit',
                fontWeight: activeKey === item ? 600 : 400,
              }}
            >
              {item}
            </UnstyledButton>
          ))}
        </Group>
      </Paper>
    </Paper>
  );
}
