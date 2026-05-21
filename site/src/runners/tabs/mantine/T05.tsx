'use client';

/**
 * tabs-mantine-T05: Dark outline tabs with icons: match Messages
 *
 * Layout: isolated_card centered titled "Support".
 * Universal variation: dark theme.
 * Component: Mantine Tabs with variant="outline".
 * Each tab header includes an icon on the left (leftSection) plus text label.
 * Tabs: Photo icon + "Gallery", Message bubble icon + "Messages", Gear icon + "Settings".
 * Initial state: "Gallery" is active.
 * Above the tab list is a small pill badge labeled "Target" that shows the same message bubble icon.
 * No other interactive elements; the user must match the target reference to the correct tab.
 * Success: Active tab is "Messages" (value: messages).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text, Badge, Group } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('gallery');

  const handleChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'messages') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">
        Support
      </Text>
      
      {/* Target reference badge */}
      <Group mb="md">
        <Badge variant="outline" leftSection={<IconMessageCircle size={14} />}>
          Target
        </Badge>
      </Group>

      <Tabs value={activeTab} onChange={handleChange} variant="outline">
        <Tabs.List>
          <Tabs.Tab value="gallery" leftSection={<IconPhoto size={16} />}>
            Gallery
          </Tabs.Tab>
          <Tabs.Tab value="messages" leftSection={<IconMessageCircle size={16} />}>
            Messages
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery" pt="md">
          <Text>Gallery panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="messages" pt="md">
          <Text>Messages panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="settings" pt="md">
          <Text>Settings panel content</Text>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
