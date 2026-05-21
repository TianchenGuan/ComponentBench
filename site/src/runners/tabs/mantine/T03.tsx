'use client';

/**
 * tabs-mantine-T03: Two instances: Account tabs to Billing
 *
 * Layout: isolated_card scene with two separate blocks one above the other.
 * Block 1 heading: "Account" with Mantine Tabs containing "Profile", "Billing", "Security".
 * Block 2 heading: "Workspace" with Mantine Tabs containing "Overview", "Members", "Integrations".
 * Initial state: Account is on "Profile"; Workspace is on "Overview".
 * Both tab lists are visible at the same time; only the Account instance is the target.
 * Success: In the "Account" tabs instance, the active tab is "Billing" (value: billing).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [accountTab, setAccountTab] = useState<string | null>('profile');
  const [workspaceTab, setWorkspaceTab] = useState<string | null>('overview');

  const handleAccountChange = (value: string | null) => {
    setAccountTab(value);
    if (value === 'billing') {
      onSuccess();
    }
  };

  return (
    <Stack gap="lg" style={{ width: 500 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder data-testid="tabs-account">
        <Text fw={600} size="lg" mb="md">
          Account
        </Text>
        <Tabs value={accountTab} onChange={handleAccountChange}>
          <Tabs.List>
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="billing">Billing</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Text>Account Profile panel</Text>
          </Tabs.Panel>
          <Tabs.Panel value="billing" pt="md">
            <Text>Account Billing panel</Text>
          </Tabs.Panel>
          <Tabs.Panel value="security" pt="md">
            <Text>Account Security panel</Text>
          </Tabs.Panel>
        </Tabs>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder data-testid="tabs-workspace">
        <Text fw={600} size="lg" mb="md">
          Workspace
        </Text>
        <Tabs value={workspaceTab} onChange={setWorkspaceTab}>
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="members">Members</Tabs.Tab>
            <Tabs.Tab value="integrations">Integrations</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Text>Workspace Overview panel</Text>
          </Tabs.Panel>
          <Tabs.Panel value="members" pt="md">
            <Text>Workspace Members panel</Text>
          </Tabs.Panel>
          <Tabs.Panel value="integrations" pt="md">
            <Text>Workspace Integrations panel</Text>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Stack>
  );
}
