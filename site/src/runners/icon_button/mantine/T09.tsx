'use client';

/**
 * icon_button-mantine-T09: Scroll to Sync section and click Retry ActionIcon (dashboard clutter)
 *
 * Layout: dashboard centered in the viewport.
 * A dashboard titled "Status" with multiple metric cards requiring scrolling.
 * The "Sync" section contains a "Retry sync" ActionIcon.
 * 
 * Success: The "Retry sync" ActionIcon has data-cb-activated="true".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Group, Box, SimpleGrid, Badge } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

const metricCards = [
  { title: 'Users', value: '12,543', change: '+5%' },
  { title: 'Revenue', value: '$45,231', change: '+12%' },
  { title: 'Orders', value: '1,234', change: '+8%' },
  { title: 'Visitors', value: '89,432', change: '+3%' },
  { title: 'Conversion', value: '3.2%', change: '-0.5%' },
  { title: 'Sessions', value: '45,678', change: '+7%' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    if (activated) return;
    setActivated(true);
    onSuccess();
  };

  return (
    <Box style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text fw={500} size="lg">Status</Text>
        <Text size="sm" c="dimmed">Dashboard overview</Text>
      </Card>

      {/* Metric cards */}
      <SimpleGrid cols={2} spacing="md" mb="md">
        {metricCards.map((card) => (
          <Card key={card.title} shadow="sm" padding="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">{card.title}</Text>
            <Text size="xl" fw={700}>{card.value}</Text>
            <Badge 
              color={card.change.startsWith('+') ? 'green' : 'red'} 
              size="sm"
            >
              {card.change}
            </Badge>
          </Card>
        ))}
      </SimpleGrid>

      {/* Additional sections */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text fw={500}>Activity Feed</Text>
        <Text size="sm" c="dimmed" mt="xs">User logged in from new device</Text>
        <Text size="sm" c="dimmed">New order placed #12345</Text>
        <Text size="sm" c="dimmed">Payment received $99.00</Text>
      </Card>

      {/* Sync section - target */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Group justify="space-between" mb="xs">
          <Text fw={500}>Sync</Text>
          <Group gap="xs">
            <Text size="xs" c="dimmed">Retry sync</Text>
            <ActionIcon
              variant="subtle"
              onClick={handleClick}
              aria-label="Retry sync"
              data-cb-activated={activated ? 'true' : 'false'}
              data-testid="mantine-action-icon-retry"
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
        </Group>
        <Text size="sm" c="dimmed">Last synced: 5 minutes ago</Text>
        {activated && (
          <Text size="sm" c="green" mt="xs">Retry started</Text>
        )}
      </Card>
    </Box>
  );
}
