'use client';

/**
 * tabs-mantine-T02: Pills tabs bottom-right: open Files
 *
 * Layout: isolated_card anchored near the bottom-right of the viewport titled "Project".
 * Component: Mantine Tabs with variant="pills" so tabs look like pill buttons.
 * Tabs: "Summary", "Files", "Members".
 * Initial state: "Summary" is active.
 * No other inputs/buttons on the card; selecting a tab immediately switches the visible panel.
 * Success: Active tab is "Files" (value: files).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('summary');

  const handleChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'files') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">
        Project
      </Text>
      <Tabs value={activeTab} onChange={handleChange} variant="pills">
        <Tabs.List>
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
          <Tabs.Tab value="files">Files</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="summary" pt="md">
          <Text>Summary panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="files" pt="md">
          <Text>Files panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="members" pt="md">
          <Text>Members panel content</Text>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
