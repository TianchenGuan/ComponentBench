'use client';

/**
 * tabs-mantine-T07: Inverted tabs: switch to Account panel
 *
 * Layout: form_section titled "Workspace" with medium clutter.
 * Component: Mantine Tabs configured with inverted=true, meaning the Tabs.Panel content appears above the Tabs.List.
 * Tabs: "Chat", "Gallery", "Account".
 * Initial state: "Chat" is active; the Chat panel (above) contains a textarea and send button (distractors).
 * The tab list itself is placed below the panel content, which is atypical and can be missed.
 * No confirmations; selecting "Account" updates the active tab and swaps the panel.
 * Success: Active tab is "Account" (value: account).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text, Textarea, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('chat');

  const handleChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'account') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">
        Workspace
      </Text>
      <Tabs value={activeTab} onChange={handleChange} inverted>
        <Tabs.Panel value="chat" pb="md">
          <Textarea
            placeholder="Type your message..."
            minRows={3}
            mb="sm"
          />
          <Group>
            <Button>Send</Button>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="gallery" pb="md">
          <Text>Gallery panel - view your images here</Text>
        </Tabs.Panel>
        <Tabs.Panel value="account" pb="md">
          <Text>Account panel - manage your account settings</Text>
        </Tabs.Panel>

        <Tabs.List>
          <Tabs.Tab value="chat">Chat</Tabs.Tab>
          <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
          <Tabs.Tab value="account">Account</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Card>
  );
}
