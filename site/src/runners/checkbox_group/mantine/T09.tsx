'use client';

/**
 * checkbox_group-mantine-T09: Match Target dashboard widgets and apply
 *
 * Scene: light theme; comfortable spacing; a dashboard-style page anchored toward the top-right.
 * Mantine analytics dashboard (light theme) with high clutter: charts, KPI cards, activity feed.
 * Near the top-right is a "Widget library" panel. Inside the panel:
 * - A Checkbox.Group labeled "Pinned widgets" (target component).
 * - Options (9) with icon + label: Traffic, Conversions, Errors, Latency, Revenue, Refunds, Signups, Churn, Uptime.
 * - A "Target dashboard" reference strip showing three widget tiles.
 * Initial state: Traffic and Uptime are checked by default.
 * At the bottom is a primary button "Apply widgets". The pinned widget set is only committed on click.
 * Success: Traffic, Errors, and Revenue are checked and Apply widgets is clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Button, Group, Badge, Box, Paper, SimpleGrid } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const widgetOptions = ['Traffic', 'Conversions', 'Errors', 'Latency', 'Revenue', 'Refunds', 'Signups', 'Churn', 'Uptime'];
const targetWidgets = ['Traffic', 'Errors', 'Revenue'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Traffic', 'Uptime']);
  const hasSucceeded = useRef(false);

  const handleApply = () => {
    const targetSet = new Set(targetWidgets);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <Group align="flex-start" gap="xl">
      {/* Dashboard content (clutter) */}
      <Box style={{ flex: 1 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Text fw={600} size="lg" mb="md">Analytics Dashboard</Text>
          <SimpleGrid cols={3} mb="md">
            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed">Visits</Text>
              <Text fw={600} size="xl">12,345</Text>
            </Paper>
            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed">Revenue</Text>
              <Text fw={600} size="xl">$45K</Text>
            </Paper>
            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed">Errors</Text>
              <Text fw={600} size="xl">23</Text>
            </Paper>
          </SimpleGrid>
          <Box 
            p="xl" 
            style={{ 
              background: '#f8f9fa', 
              borderRadius: 8, 
              textAlign: 'center',
              color: '#adb5bd'
            }}
          >
            Chart Placeholder
          </Box>
        </Card>

        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="xs">Activity Feed</Text>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">User signed up • 2min ago</Text>
            <Text size="xs" c="dimmed">Order placed • 5min ago</Text>
            <Text size="xs" c="dimmed">Payment received • 10min ago</Text>
          </Stack>
        </Card>
      </Box>

      {/* Widget library panel */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 280 }}>
        <Text fw={600} size="lg" mb="md">Widget library</Text>
        
        {/* Target dashboard reference */}
        <Box mb="md" p="sm" style={{ background: '#f8f9fa', borderRadius: 8 }}>
          <Text size="xs" c="dimmed" mb="xs">Target dashboard</Text>
          <Group gap="xs">
            {targetWidgets.map(w => (
              <Badge key={w} variant="filled" color="blue" size="sm">{w}</Badge>
            ))}
          </Group>
        </Box>

        <Text fw={500} size="sm" mb="xs">Pinned widgets</Text>
        <Checkbox.Group
          data-testid="cg-pinned-widgets"
          value={selected}
          onChange={setSelected}
        >
          <Stack gap="xs" mb="md">
            {widgetOptions.map(widget => (
              <Checkbox key={widget} value={widget} label={`📊 ${widget}`} />
            ))}
          </Stack>
        </Checkbox.Group>

        <Button fullWidth onClick={handleApply} data-testid="btn-apply-widgets">
          Apply widgets
        </Button>
      </Card>
    </Group>
  );
}
