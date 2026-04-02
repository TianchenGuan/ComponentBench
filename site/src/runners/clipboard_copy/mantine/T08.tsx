'use client';

/**
 * clipboard_copy-mantine-T08: Copy STAGING webhook in dark dashboard
 *
 * Layout: dashboard, centered.
 * Universal factors: theme=dark, clutter=high.
 *
 * The dashboard has multiple widgets (charts, recent events list, status badges) as realistic clutter.
 * In the middle column there is an "Environments" section with three compact cards:
 * - DEV (green badge)
 * - STAGING (orange badge)  ← target
 * - PROD (red badge)
 *
 * Each environment card contains a labeled value "Webhook endpoint" displayed in monospace and a Mantine CopyButton ActionIcon.
 * Endpoints:
 * - DEV: https://hooks.example.com/dev/mt-21
 * - STAGING: https://hooks.example.com/staging/mt-88  (target)
 * - PROD: https://hooks.example.com/prod/mt-55
 *
 * Component behavior:
 * - Clicking the copy icon on a card copies that card's full endpoint and briefly switches the icon/tooltip to "Copied".
 *
 * Requirement: instances=3; target instance is the STAGING card's copy icon.
 *
 * Success: Clipboard text equals "https://hooks.example.com/staging/mt-88".
 */

import React, { useState } from 'react';
import { Card, Text, Badge, Group, ActionIcon, Tooltip, CopyButton as MantineCopyButton, Stack, Box, Paper, Title, List } from '@mantine/core';
import { IconCopy, IconCheck, IconChartBar, IconBell, IconActivity } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const environments = [
  { id: 'dev', name: 'DEV', color: 'green', endpoint: 'https://hooks.example.com/dev/mt-21' },
  { id: 'staging', name: 'STAGING', color: 'orange', endpoint: 'https://hooks.example.com/staging/mt-88' },  // target
  { id: 'prod', name: 'PROD', color: 'red', endpoint: 'https://hooks.example.com/prod/mt-55' },
];

const targetEndpoint = 'https://hooks.example.com/staging/mt-88';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (endpoint: string, envId: string) => {
    await copyToClipboard(endpoint, `${envId.toUpperCase()} card`);
    setCopiedId(envId);
    setTimeout(() => setCopiedId(null), 2000);

    // Only complete if STAGING was copied
    if (endpoint === targetEndpoint && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Box style={{ width: 600 }} data-testid="dashboard">
      <Title order={3} mb="md">Dashboard</Title>
      
      <Stack gap="md">
        {/* Clutter: Charts widget */}
        <Paper p="md" withBorder>
          <Group mb="sm">
            <IconChartBar size={20} />
            <Text fw={500}>Analytics</Text>
          </Group>
          <Text size="xl" fw={700}>12,847</Text>
          <Text size="xs" c="dimmed">Total requests this week</Text>
        </Paper>

        {/* Clutter: Recent events */}
        <Paper p="md" withBorder>
          <Group mb="sm">
            <IconBell size={20} />
            <Text fw={500}>Recent events</Text>
          </Group>
          <List size="sm" spacing="xs">
            <List.Item>User signup - 2 mins ago</List.Item>
            <List.Item>Payment received - 15 mins ago</List.Item>
            <List.Item>API error - 1 hour ago</List.Item>
          </List>
        </Paper>

        {/* Clutter: Status */}
        <Paper p="md" withBorder>
          <Group mb="sm">
            <IconActivity size={20} />
            <Text fw={500}>System status</Text>
          </Group>
          <Badge color="green">All systems operational</Badge>
        </Paper>

        {/* Target: Environments section */}
        <Card shadow="sm" p="md" withBorder data-testid="environments-section">
          <Text fw={500} mb="md">Environments</Text>
          
          <Stack gap="sm">
            {environments.map((env) => (
              <Box
                key={env.id}
                p="sm"
                style={{ background: '#f8f9fa', borderRadius: 8 }}
                data-testid={`env-card-${env.id}`}
              >
                <Group justify="space-between" mb="xs">
                  <Badge color={env.color} variant="filled">{env.name}</Badge>
                </Group>
                <Group justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed">Webhook endpoint:</Text>
                    <Text ff="monospace" size="xs" style={{ wordBreak: 'break-all' }}>
                      {env.endpoint}
                    </Text>
                  </Box>
                  <MantineCopyButton value={env.endpoint} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied || copiedId === env.id ? 'Copied' : 'Copy'} withArrow>
                        <ActionIcon
                          color={copied || copiedId === env.id ? 'teal' : 'gray'}
                          variant="subtle"
                          onClick={() => {
                            copy();
                            handleCopy(env.endpoint, env.id);
                          }}
                          data-testid={`copy-${env.id}-endpoint`}
                          aria-label={`Copy ${env.name} webhook endpoint`}
                        >
                          {copied || copiedId === env.id ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </MantineCopyButton>
                </Group>
              </Box>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
