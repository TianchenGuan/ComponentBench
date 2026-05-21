'use client';

/**
 * listbox_single-mantine-T02: Settings navigation: go to Security
 *
 * Scene: light theme, comfortable spacing, dashboard layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A dashboard layout shows a left sidebar card labeled "Settings" containing a listbox built from Mantine
 * NavLink items: "Profile", "Notifications", "Security", "Integrations". The active item is highlighted.
 * The main panel shows read-only placeholder content that changes based on the active sidebar item but is not
 * required for success. Initial active item is "Profile".
 *
 * Success: Selected option value equals: security
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, Box, Paper } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const sidebarOptions = [
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'security', label: 'Security' },
  { value: 'integrations', label: 'Integrations' },
];

const contentBySection: Record<string, React.ReactNode> = {
  profile: <Text c="dimmed">Manage your profile settings</Text>,
  notifications: <Text c="dimmed">Configure notification preferences</Text>,
  security: <Text c="dimmed">Security and privacy settings</Text>,
  integrations: <Text c="dimmed">Connected apps and services</Text>,
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('profile');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'security') {
      onSuccess();
    }
  };

  return (
    <Box style={{ display: 'flex', width: 600, gap: 16 }}>
      {/* Sidebar */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 200 }}>
        <Text fw={600} mb="sm">Settings</Text>
        <Stack
          gap="xs"
          data-cb-listbox-root
          data-cb-selected-value={selected}
          role="listbox"
        >
          {sidebarOptions.map(opt => (
            <NavLink
              key={opt.value}
              label={opt.label}
              active={selected === opt.value}
              onClick={() => handleSelect(opt.value)}
              data-cb-option-value={opt.value}
              role="option"
              aria-selected={selected === opt.value}
            />
          ))}
        </Stack>
      </Card>

      {/* Main content */}
      <Paper shadow="sm" p="lg" radius="md" withBorder style={{ flex: 1 }}>
        <Text fw={600} size="lg" mb="md" tt="capitalize">{selected}</Text>
        {contentBySection[selected]}
      </Paper>
    </Box>
  );
}
