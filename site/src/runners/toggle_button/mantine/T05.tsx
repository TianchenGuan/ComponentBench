'use client';

/**
 * toggle_button-mantine-T25: Match Auto-sync toggle to mixed reference
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale. Guidance is mixed.
 *
 * The card title is "Auto-sync". At the top of the card, a row labeled "Reference" shows:
 * - A small colored badge with an icon (checkmark for ON, dash for OFF)
 * - A short text label inside the badge (e.g., "ON")
 * For this task, the reference indicates ON.
 *
 * Below is the interactive Mantine Button used as a toggle button labeled "Auto-sync".
 * - aria-pressed represents the pressed state
 * - Off = outline/subtle; On = filled/active (data-active)
 *
 * Initial state: Auto-sync is Off. The goal is to set it to match the reference (On).
 */

import React, { useState } from 'react';
import { Card, Text, Button, Group, Badge } from '@mantine/core';
import { IconCheck, IconMinus, IconRefresh } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false);
  const targetState = true; // Target is ON

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (newPressed === targetState) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Auto-sync</Text>
      
      {/* Reference */}
      <Group justify="flex-end" align="center" mb="md">
        <Text size="xs" c="dimmed">Reference:</Text>
        <Badge
          color={targetState ? 'blue' : 'gray'}
          variant={targetState ? 'filled' : 'outline'}
          leftSection={targetState ? <IconCheck size={12} /> : <IconMinus size={12} />}
        >
          {targetState ? 'ON' : 'OFF'}
        </Badge>
      </Group>

      {/* Interactive toggle */}
      <Button
        variant={pressed ? 'filled' : 'outline'}
        leftSection={pressed ? <IconCheck size={16} /> : <IconRefresh size={16} />}
        onClick={handleClick}
        aria-pressed={pressed}
        data-active={pressed || undefined}
        data-testid="auto-sync-toggle"
      >
        Auto-sync
      </Button>

      <Text size="xs" c="dimmed" mt="md">
        Auto-sync: {pressed ? 'On' : 'Off'}
      </Text>
    </Card>
  );
}
