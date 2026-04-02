'use client';

/**
 * time_input_text-mantine-T07: Scroll to find Quiet hours start time on a dashboard
 * 
 * Layout: dashboard in light theme with comfortable spacing. The page scrolls vertically.
 * Multiple dashboard cards are shown (clutter=medium): "Overview", "Recent activity", "Notifications", etc.
 * The target field is inside the "Notifications" card, which is placed near the bottom of the page (requires scrolling).
 * Inside that card there is one Mantine TimeInput labeled "Quiet hours start time" with initial value 23:00.
 * Only this TimeInput value determines success.
 * 
 * Success: The TimeInput labeled "Quiet hours start time" equals 22:15.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Progress, Badge, Group } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [quietHoursTime, setQuietHoursTime] = useState('23:00');

  useEffect(() => {
    if (quietHoursTime === '22:15') {
      onSuccess();
    }
  }, [quietHoursTime, onSuccess]);

  return (
    <div style={{ maxHeight: 500, overflow: 'auto', padding: 16 }}>
      <Stack gap="md">
        {/* Distractor cards */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="lg" mb="sm">Overview</Text>
          <Group mb="sm">
            <Badge>Active</Badge>
            <Badge color="green">Online</Badge>
          </Group>
          <Text size="sm" c="dimmed">System status is normal. All services running.</Text>
        </Card>
        
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="lg" mb="sm">Recent activity</Text>
          <Stack gap="xs">
            <Text size="sm">• User login at 09:30</Text>
            <Text size="sm">• Report generated at 10:15</Text>
            <Text size="sm">• Settings updated at 11:00</Text>
          </Stack>
        </Card>
        
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="lg" mb="sm">Storage</Text>
          <Progress value={65} mb="xs" />
          <Text size="sm" c="dimmed">65% of 100GB used</Text>
        </Card>
        
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="lg" mb="sm">Performance</Text>
          <Group gap="xl">
            <div>
              <Text size="xl" fw={700}>98%</Text>
              <Text size="xs" c="dimmed">Uptime</Text>
            </div>
            <div>
              <Text size="xl" fw={700}>45ms</Text>
              <Text size="xs" c="dimmed">Latency</Text>
            </div>
          </Group>
        </Card>
        
        {/* Target card - requires scrolling */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="lg" mb="sm">Notifications</Text>
          <Text size="sm" c="dimmed" mb="md">Configure notification preferences.</Text>
          
          <div>
            <Text component="label" htmlFor="quiet-hours-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Quiet hours start time
            </Text>
            <TimeInput
              id="quiet-hours-time"
              value={quietHoursTime}
              onChange={(event) => setQuietHoursTime(event.currentTarget.value)}
              data-testid="quiet-hours-start-time"
            />
          </div>
        </Card>
      </Stack>
    </div>
  );
}
