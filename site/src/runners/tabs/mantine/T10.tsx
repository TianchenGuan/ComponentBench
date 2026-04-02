'use client';

/**
 * tabs-mantine-T10: Confirm to enter Danger zone tab
 *
 * Layout: settings_panel titled "Account Settings" with medium clutter (several toggles and helper text blocks).
 * Component: Mantine Tabs with tabs "General", "Billing", "Danger zone".
 * Initial state: "General" is active.
 * When attempting to switch to "Danger zone", a confirmation prompt appears (modal or centered confirm box) warning about sensitive settings.
 * Prompt actions: "Cancel" and primary "Proceed".
 * Only after clicking "Proceed" does the active tab change to "Danger zone".
 * No other tab components on the page.
 * Success: Active tab is "Danger zone" (value: danger).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text, Modal, Button, Group, Switch, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('general');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = (value: string | null) => {
    if (value === 'danger') {
      setConfirmOpen(true);
    } else {
      setActiveTab(value);
    }
  };

  const handleProceed = () => {
    setActiveTab('danger');
    setConfirmOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">
        Account Settings
      </Text>

      {/* Clutter: toggles and helper text */}
      <Stack gap="xs" mb="md">
        <Group>
          <Switch label="Email notifications" />
        </Group>
        <Group>
          <Switch label="Two-factor authentication" defaultChecked />
        </Group>
        <Text size="xs" c="dimmed">
          Configure your account preferences below. Some settings may require confirmation.
        </Text>
      </Stack>

      <Tabs value={activeTab} onChange={handleChange}>
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
          <Tabs.Tab value="danger" color="red">Danger zone</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Text>General settings panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="billing" pt="md">
          <Text>Billing settings panel content</Text>
        </Tabs.Panel>
        <Tabs.Panel value="danger" pt="md">
          <Text c="red">Danger zone - handle with care!</Text>
        </Tabs.Panel>
      </Tabs>

      <Modal opened={confirmOpen} onClose={handleCancel} title="Warning" centered>
        <Text mb="md">
          You are about to enter the Danger zone. This section contains sensitive settings that could affect your account.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button color="red" onClick={handleProceed}>Proceed</Button>
        </Group>
      </Modal>
    </Card>
  );
}
