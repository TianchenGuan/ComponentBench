'use client';

/**
 * tabs-mantine-T01: Basic Mantine tabs: go to Messages
 *
 * Layout: isolated_card centered titled "Inbox".
 * Component: Mantine Tabs (default variant, horizontal) with three tabs.
 * Tabs: "Gallery", "Messages", "Settings".
 * Initial state: "Gallery" is active (defaultValue="gallery").
 * Panels contain short placeholder text and update immediately when switching tabs.
 * No other interactive elements or overlays.
 * Success: Active tab is "Messages" (value: messages).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
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
        Inbox
      </Text>
      <Tabs value={activeTab} onChange={handleChange}>
        <Tabs.List>
          <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
          <Tabs.Tab value="messages">Messages</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
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
