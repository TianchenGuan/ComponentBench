'use client';

/**
 * password_input-mantine-T08: Scroll a dashboard to find the Webhook password field
 * 
 * A dashboard layout contains multiple cards (Status, Usage, Alerts, Recent activity). The page
 * is scrollable and the target card "Secrets" appears near the bottom.
 * Inside the "Secrets" card is a Mantine PasswordInput labeled "Webhook password" (initially empty)
 * with a visibility toggle. Other cards include buttons and charts as medium clutter.
 * No confirmation button is required; the task ends when the correct value is entered.
 * 
 * Success: The PasswordInput labeled "Webhook password" equals exactly "Hook-9!Zulu".
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text, Progress, Button, Badge, Group, Stack, SimpleGrid } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [webhookPassword, setWebhookPassword] = useState('');

  useEffect(() => {
    if (webhookPassword === 'Hook-9!Zulu') {
      onSuccess();
    }
  }, [webhookPassword, onSuccess]);

  return (
    <div style={{ width: 500, maxHeight: 500, overflowY: 'auto', padding: 16 }} data-testid="dashboard-scroll-area">
      <Text fw={700} size="xl" mb="lg">Dashboard</Text>
      
      <Stack gap="lg">
        {/* Status Card */}
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="card-status">
          <Text fw={600} mb="sm">Status</Text>
          <Group>
            <Badge color="green">Online</Badge>
            <Badge color="blue">Synced</Badge>
          </Group>
        </Card>

        {/* Usage Card */}
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="card-usage">
          <Text fw={600} mb="sm">Usage</Text>
          <Text size="sm" c="dimmed" mb={4}>Storage: 65%</Text>
          <Progress value={65} color="blue" />
          <Text size="sm" c="dimmed" mt="sm" mb={4}>API Calls: 42%</Text>
          <Progress value={42} color="teal" />
        </Card>

        {/* Alerts Card */}
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="card-alerts">
          <Text fw={600} mb="sm">Alerts</Text>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm">High CPU usage detected</Text>
              <Button size="xs" variant="light">Dismiss</Button>
            </Group>
            <Group justify="space-between">
              <Text size="sm">New security update available</Text>
              <Button size="xs" variant="light">View</Button>
            </Group>
          </Stack>
        </Card>

        {/* Recent Activity Card */}
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="card-activity">
          <Text fw={600} mb="sm">Recent activity</Text>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">• User login at 10:32 AM</Text>
            <Text size="sm" c="dimmed">• Settings updated at 9:15 AM</Text>
            <Text size="sm" c="dimmed">• Backup completed at 8:00 AM</Text>
          </Stack>
        </Card>

        {/* Secrets Card - TARGET */}
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="card-secrets">
          <Text fw={600} mb="sm">Secrets</Text>
          <PasswordInput
            label="Webhook password"
            value={webhookPassword}
            onChange={(e) => setWebhookPassword(e.target.value)}
            data-testid="webhook-password-input"
          />
        </Card>
      </Stack>
    </div>
  );
}
