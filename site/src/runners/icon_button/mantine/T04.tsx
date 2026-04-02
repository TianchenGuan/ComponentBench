'use client';

/**
 * icon_button-mantine-T04: Set Theme mode to Dark (ActionIcon group)
 *
 * Layout: settings_panel centered in the viewport.
 * An "Appearance" settings panel includes a "Theme mode" row with three ActionIcons:
 * Light (sun), Dark (moon), Auto (monitor).
 * Initial state: Light selected.
 * 
 * Success: The "Theme: Dark" ActionIcon has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Group, Box, Divider } from '@mantine/core';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

type ThemeMode = 'light' | 'dark' | 'auto';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  const handleSelect = (value: ThemeMode) => {
    setTheme(value);
    if (value === 'dark') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Appearance
      </Text>

      {/* Static rows */}
      <Box mb="md" style={{ color: 'var(--mantine-color-dimmed)' }}>
        <Group justify="space-between" mb="xs">
          <Text size="sm">Accent color</Text>
          <Text size="sm" c="dimmed">Blue</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm">Text size</Text>
          <Text size="sm" c="dimmed">Medium</Text>
        </Group>
      </Box>

      <Divider mb="md" />

      {/* Theme mode row */}
      <Group justify="space-between">
        <Text size="sm">Theme mode: {theme.charAt(0).toUpperCase() + theme.slice(1)}</Text>
        <Group gap="xs">
          <ActionIcon
            variant={theme === 'light' ? 'filled' : 'default'}
            onClick={() => handleSelect('light')}
            aria-label="Theme: Light"
            aria-pressed={theme === 'light'}
            data-testid="mantine-action-icon-theme-light"
          >
            <IconSun size={18} />
          </ActionIcon>
          <ActionIcon
            variant={theme === 'dark' ? 'filled' : 'default'}
            onClick={() => handleSelect('dark')}
            aria-label="Theme: Dark"
            aria-pressed={theme === 'dark'}
            data-testid="mantine-action-icon-theme-dark"
          >
            <IconMoon size={18} />
          </ActionIcon>
          <ActionIcon
            variant={theme === 'auto' ? 'filled' : 'default'}
            onClick={() => handleSelect('auto')}
            aria-label="Theme: Auto"
            aria-pressed={theme === 'auto'}
            data-testid="mantine-action-icon-theme-auto"
          >
            <IconDeviceDesktop size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}
