'use client';

/**
 * tooltip-mantine-T09: Floating tooltip that follows the mouse (two instances)
 *
 * Light theme, comfortable spacing, dashboard layout anchored to the top-left.
 * Two large status boxes are displayed:
 * - Production box uses Mantine Tooltip.Floating label "Live traffic"
 * - Staging box uses Mantine Tooltip.Floating label "Requests routed to staging" (TARGET)
 * Tooltip.Floating follows the mouse cursor while hovering over the box.
 * Instances: 2 floating tooltips. Clutter: low (a header and timestamp). Initial state: no tooltip visible.
 */

import React, { useRef } from 'react';
import { Card, Text, Tooltip, Box, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStagingEnter = () => {
    if (successCalledRef.current) return;
    hoverTimerRef.current = setTimeout(() => {
      if (!successCalledRef.current) {
        successCalledRef.current = true;
        onSuccess();
      }
    }, 400);
  };
  const handleStagingLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 480 }}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">Environment Status</Text>
        <Text size="xs" c="dimmed">Updated: just now</Text>
      </Group>

      <Group grow>
        <Tooltip.Floating label="Live traffic">
          <Box
            style={{
              padding: 24,
              background: '#e8f5e9',
              borderRadius: 8,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px solid #4caf50',
            }}
            data-testid="tooltip-trigger-production"
          >
            <Text fw={500} mb="xs">Production</Text>
            <Text size="xl" fw={700} c="green">98.5%</Text>
            <Text size="xs" c="dimmed">uptime</Text>
          </Box>
        </Tooltip.Floating>

        <Tooltip.Floating label="Requests routed to staging">
          <Box
            onMouseEnter={handleStagingEnter}
            onMouseLeave={handleStagingLeave}
            style={{
              padding: 24,
              background: '#fff3e0',
              borderRadius: 8,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px solid #ff9800',
            }}
            data-testid="tooltip-trigger-staging"
          >
            <Text fw={500} mb="xs">Staging</Text>
            <Text size="xl" fw={700} c="orange">92.1%</Text>
            <Text size="xs" c="dimmed">uptime</Text>
          </Box>
        </Tooltip.Floating>
      </Group>
    </Card>
  );
}
