'use client';

/**
 * toggle_button-mantine-T30: Scroll to Experimental section and enable Offline mode
 *
 * Layout: settings_panel centered. Light theme, comfortable spacing, default scale. Clutter is medium.
 *
 * The settings page has a left "Contents" list (non-sticky) and a long main column that requires scrolling.
 * The main column contains multiple sections in order: "General", "Notifications", "Appearance", and then "Experimental" further down.
 *
 * In the "Experimental" section there are four Mantine Button toggles:
 * - "New sidebar"
 * - "Offline mode"  ← target
 * - "Faster sync"
 * - "Debug overlay"
 *
 * Each toggle uses aria-pressed and data-active styling. Initial states are mixed, but the target "Offline mode" starts Off.
 *
 * The task requires finding the "Experimental" header by scrolling and then toggling "Offline mode" On.
 */

import React, { useState } from 'react';
import { Card, Text, Button, Stack, Box, Group, Paper, NavLink } from '@mantine/core';
import { IconSettings, IconBell, IconPalette, IconFlask, IconCheck, IconLayoutSidebar, IconWifi, IconBolt, IconBug } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToggleItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  pressed: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleItem[]>([
    { key: 'new-sidebar', label: 'New sidebar', icon: <IconLayoutSidebar size={16} />, pressed: true },
    { key: 'offline-mode', label: 'Offline mode', icon: <IconWifi size={16} />, pressed: false }, // Target: starts Off
    { key: 'faster-sync', label: 'Faster sync', icon: <IconBolt size={16} />, pressed: false },
    { key: 'debug-overlay', label: 'Debug overlay', icon: <IconBug size={16} />, pressed: true },
  ]);

  const handleToggle = (key: string) => {
    setToggles(prev => prev.map(toggle => {
      if (toggle.key === key) {
        const newPressed = !toggle.pressed;
        // Success when Offline mode is turned ON
        if (key === 'offline-mode' && newPressed) {
          onSuccess();
        }
        return { ...toggle, pressed: newPressed };
      }
      return toggle;
    }));
  };

  return (
    <Box style={{ height: 500, overflowY: 'auto', background: '#f8f9fa', padding: 16 }}>
      <Card shadow="sm" padding={0} radius="md" withBorder style={{ width: '100%' }}>
        <Group wrap="nowrap" gap={0} align="stretch">
          {/* Contents sidebar */}
          <Box style={{ width: 180, borderRight: '1px solid var(--mantine-color-gray-3)' }} p="sm">
            <Text size="xs" c="dimmed" mb="xs">Contents</Text>
            <Stack gap={4}>
              <NavLink label="General" leftSection={<IconSettings size={14} />} />
              <NavLink label="Notifications" leftSection={<IconBell size={14} />} />
              <NavLink label="Appearance" leftSection={<IconPalette size={14} />} />
              <NavLink label="Experimental" leftSection={<IconFlask size={14} />} />
            </Stack>
          </Box>

          {/* Main content */}
          <Box p="lg" style={{ flex: 1 }}>
            <Text fw={500} size="lg" mb="lg">Settings</Text>

            {/* General section */}
            <Paper p="md" withBorder mb="md">
              <Text fw={500} mb="sm">General</Text>
              <Text size="sm" c="dimmed">General application settings and preferences.</Text>
            </Paper>

            {/* Notifications section */}
            <Paper p="md" withBorder mb="md">
              <Text fw={500} mb="sm">Notifications</Text>
              <Text size="sm" c="dimmed">Configure how you receive notifications.</Text>
            </Paper>

            {/* Appearance section */}
            <Paper p="md" withBorder mb="md">
              <Text fw={500} mb="sm">Appearance</Text>
              <Text size="sm" c="dimmed">Customize the look and feel of the application.</Text>
            </Paper>

            {/* Experimental section - TARGET */}
            <Paper p="md" withBorder data-testid="experimental-section">
              <Text fw={500} mb="md">Experimental</Text>
              <Stack gap="sm">
                {toggles.map(toggle => (
                  <Group key={toggle.key} justify="space-between" align="center">
                    <Text size="sm">{toggle.label}</Text>
                    <Button
                      variant={toggle.pressed ? 'filled' : 'outline'}
                      size="xs"
                      leftSection={toggle.pressed ? <IconCheck size={14} /> : toggle.icon}
                      onClick={() => handleToggle(toggle.key)}
                      aria-pressed={toggle.pressed}
                      data-active={toggle.pressed || undefined}
                      data-testid={`toggle-${toggle.key}`}
                    >
                      {toggle.pressed ? 'On' : 'Off'}
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Paper>

            {/* Extra section at bottom */}
            <Paper p="md" withBorder mt="md">
              <Text fw={500} mb="sm">About</Text>
              <Text size="sm" c="dimmed">Version 3.2.1</Text>
            </Paper>
          </Box>
        </Group>
      </Card>
    </Box>
  );
}
