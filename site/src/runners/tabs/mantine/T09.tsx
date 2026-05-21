'use client';

/**
 * tabs-mantine-T09: Icon-only tabs: visual match to Settings
 *
 * Layout: isolated_card centered titled "Icon Tabs".
 * Universal variations: component scale is small and guidance is visual.
 * Component: Mantine Tabs where each Tabs.Tab displays only an icon (no visible text label). Each tab still has an accessible name via aria-label.
 * There are five icon tabs in a row: Photo, Message, Settings (gear), Bell, User.
 * Initial state: Photo tab is active.
 * Above the tab list is a "Target" card that displays a single icon; it matches exactly one of the tab icons (the gear).
 * No other components or overlays.
 * Success: Active tab is the Settings gear tab (value: settings).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text, Box, Paper } from '@mantine/core';
import { IconPhoto, IconMessage, IconSettings, IconBell, IconUser } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('photo');

  const handleChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'settings') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="md" mb="sm">
        Icon Tabs
      </Text>
      
      {/* Target reference */}
      <Paper p="xs" withBorder mb="md" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Text size="xs" c="dimmed">Target:</Text>
        <IconSettings size={18} />
      </Paper>

      <Tabs value={activeTab} onChange={handleChange}>
        <Tabs.List grow>
          <Tabs.Tab value="photo" aria-label="Photo">
            <IconPhoto size={18} />
          </Tabs.Tab>
          <Tabs.Tab value="messages" aria-label="Messages">
            <IconMessage size={18} />
          </Tabs.Tab>
          <Tabs.Tab value="settings" aria-label="Settings">
            <IconSettings size={18} />
          </Tabs.Tab>
          <Tabs.Tab value="bell" aria-label="Notifications">
            <IconBell size={18} />
          </Tabs.Tab>
          <Tabs.Tab value="user" aria-label="User">
            <IconUser size={18} />
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="photo" pt="sm">
          <Text size="sm">Photo panel</Text>
        </Tabs.Panel>
        <Tabs.Panel value="messages" pt="sm">
          <Text size="sm">Messages panel</Text>
        </Tabs.Panel>
        <Tabs.Panel value="settings" pt="sm">
          <Text size="sm">Settings panel</Text>
        </Tabs.Panel>
        <Tabs.Panel value="bell" pt="sm">
          <Text size="sm">Notifications panel</Text>
        </Tabs.Panel>
        <Tabs.Panel value="user" pt="sm">
          <Text size="sm">User panel</Text>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
