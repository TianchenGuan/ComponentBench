'use client';

/**
 * toggle_button-mantine-T28: Match Auto-refresh to target preview in bottom-left dashboard card
 *
 * Layout: dashboard with the "Live metrics" widget anchored near the bottom-left of the viewport.
 * Theme is light, spacing comfortable, scale default. Clutter is medium. Guidance is visual.
 *
 * In the "Live metrics" widget:
 * - A small "Target state" preview appears in the header (a miniature non-interactive toggle rendering).
 *   For this task, the preview shows OFF (unpressed).
 * - The widget body includes two Mantine Button toggles:
 *   1) "Auto-refresh"  ← target
 *   2) "Show annotations" (distractor)
 * Both toggles use aria-pressed and a data-active style for the pressed state.
 *
 * Initial state: Auto-refresh is On (pressed), while the target preview indicates it should be Off.
 * The correct action is to set Auto-refresh to Off to match the preview.
 */

import React, { useState } from 'react';
import { Card, Text, Button, Group, Box, Badge, Paper, Stack } from '@mantine/core';
import { IconCheck, IconMinus, IconRefresh, IconNote } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [autoRefresh, setAutoRefresh] = useState(true); // Initial: On
  const [showAnnotations, setShowAnnotations] = useState(false);
  const targetState = false; // Target is OFF

  const handleAutoRefresh = () => {
    const newPressed = !autoRefresh;
    setAutoRefresh(newPressed);
    if (newPressed === targetState) {
      onSuccess();
    }
  };

  const handleShowAnnotations = () => {
    setShowAnnotations(!showAnnotations);
    // Does not trigger success
  };

  return (
    <Stack gap="md">
      {/* Clutter tiles */}
      <Group>
        <Paper p="sm" withBorder style={{ minWidth: 100 }}>
          <Text size="xs" c="dimmed">CPU</Text>
          <Text>45%</Text>
        </Paper>
        <Paper p="sm" withBorder style={{ minWidth: 100 }}>
          <Text size="xs" c="dimmed">Memory</Text>
          <Text>2.1 GB</Text>
        </Paper>
        <Paper p="sm" withBorder style={{ minWidth: 100 }}>
          <Text size="xs" c="dimmed">Network</Text>
          <Text>12 MB/s</Text>
        </Paper>
      </Group>

      {/* Live metrics widget */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">Live metrics</Text>
          <Group gap="xs">
            <Text size="xs" c="dimmed">Target state:</Text>
            <Badge
              color={targetState ? 'blue' : 'gray'}
              variant={targetState ? 'filled' : 'outline'}
              leftSection={targetState ? <IconCheck size={10} /> : <IconMinus size={10} />}
              size="sm"
            >
              {targetState ? 'ON' : 'OFF'}
            </Badge>
          </Group>
        </Group>

        <Stack gap="sm">
          <Button
            variant={autoRefresh ? 'filled' : 'outline'}
            leftSection={autoRefresh ? <IconCheck size={16} /> : <IconRefresh size={16} />}
            onClick={handleAutoRefresh}
            aria-pressed={autoRefresh}
            data-active={autoRefresh || undefined}
            data-testid="auto-refresh-toggle"
          >
            Auto-refresh
          </Button>

          <Button
            variant={showAnnotations ? 'filled' : 'outline'}
            leftSection={showAnnotations ? <IconCheck size={16} /> : <IconNote size={16} />}
            onClick={handleShowAnnotations}
            aria-pressed={showAnnotations}
            data-active={showAnnotations || undefined}
            data-testid="show-annotations-toggle"
          >
            Show annotations
          </Button>
        </Stack>

        <Text size="xs" c="dimmed" mt="md">
          Auto-refresh: {autoRefresh ? 'On' : 'Off'}
        </Text>
      </Card>
    </Stack>
  );
}
