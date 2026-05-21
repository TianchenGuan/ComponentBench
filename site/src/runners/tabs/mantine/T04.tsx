'use client';

/**
 * tabs-mantine-T04: Vertical tabs right placement: go to Integrations
 *
 * Layout: settings_panel titled "Service Settings".
 * Component: Mantine Tabs with orientation="vertical".
 * The Tabs.List is placed on the right side (placement="right"), with the content panel on the left.
 * Tabs: "General", "Integrations", "Billing", "Logs".
 * Initial state: "General" is active.
 * Clutter: low—there is a short description paragraph above the panel, but no other controls are required.
 * Switching tabs updates the highlighted tab and swaps the content immediately.
 * Success: Active tab is "Integrations" (value: integrations).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('general');

  const handleChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'integrations') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">
        Service Settings
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Configure your service settings below. Select a category from the tabs on the right.
      </Text>
      <Tabs value={activeTab} onChange={handleChange} orientation="vertical" placement="right">
        <Tabs.Panel value="general" pr="md">
          <Text>General settings panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="integrations" pr="md">
          <Text>Integrations settings panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="billing" pr="md">
          <Text>Billing settings panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="logs" pr="md">
          <Text>Logs settings panel content</Text>
        </Tabs.Panel>

        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="integrations">Integrations</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
          <Tabs.Tab value="logs">Logs</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Card>
  );
}
