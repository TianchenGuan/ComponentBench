'use client';

/**
 * radio_group-mantine-T06: Security tab: set two-factor method to SMS
 *
 * A settings_panel layout is anchored near the top-left and uses Mantine Tabs with three tab labels: "General", "Notifications", and "Security".
 * The page initially shows the General tab.
 * Only the Security tab contains the target radio group.
 * In the Security tab, there is a Mantine Radio.Group labeled "Two-factor method" with options:
 * - Authenticator app
 * - SMS
 * - Email
 * Initial state (in Security): Authenticator app.
 * Other non-target controls on Security (a password text field and a "Regenerate backup codes" button) are present as clutter but not required.
 * Selection auto-saves and shows a small inline "Saved" text under the group.
 *
 * Success: The "Two-factor method" Radio.Group selected value equals "sms" (label "SMS").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Stack, Tabs, TextInput, Button, Group, Switch } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [method, setMethod] = useState<string>('authenticator');
  const [saved, setSaved] = useState(false);

  const handleMethodChange = (value: string) => {
    setMethod(value);
    setSaved(true);
    if (value === 'sms') {
      onSuccess();
    }
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Settings</Text>

      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
          <Tabs.Tab value="security">Security</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm">Auto-save</Text>
              <Switch defaultChecked />
            </Group>
            <Group justify="space-between">
              <Text size="sm">Dark mode</Text>
              <Switch />
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="notifications" pt="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm">Email notifications</Text>
              <Switch defaultChecked />
            </Group>
            <Group justify="space-between">
              <Text size="sm">Push notifications</Text>
              <Switch />
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="md">
          <Stack gap="md">
            <TextInput 
              label="Current password" 
              placeholder="Enter password" 
              type="password"
            />
            
            <Radio.Group
              data-canonical-type="radio_group"
              data-selected-value={method}
              value={method}
              onChange={handleMethodChange}
              label="Two-factor method"
            >
              <Stack gap="xs" mt="xs">
                <Radio value="authenticator" label="Authenticator app" />
                <Radio value="sms" label="SMS" />
                <Radio value="email" label="Email" />
              </Stack>
            </Radio.Group>
            {saved && <Text size="xs" c="green">Saved</Text>}

            <Button variant="outline" size="sm">
              Regenerate backup codes
            </Button>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
