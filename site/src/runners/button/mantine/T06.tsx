'use client';

/**
 * button-mantine-T06: Mute alerts (toggle-style button)
 * 
 * Centered card titled "Alerts" with two buttons:
 * - "Mute alerts" (toggle, aria-pressed)
 * - "Send test alert" (regular button)
 * Task: Toggle "Mute alerts" to ON.
 */

import React, { useState } from 'react';
import { Button, Card, Text, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [muted, setMuted] = useState(false);

  const handleMuteToggle = () => {
    const newState = !muted;
    setMuted(newState);
    if (newState) {
      onSuccess();
    }
  };

  const handleTestAlert = () => {
    // Does nothing for this task
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Alerts
      </Text>
      <Stack gap="md">
        <Button
          variant={muted ? 'filled' : 'default'}
          onClick={handleMuteToggle}
          aria-pressed={muted}
          fullWidth
          data-testid="mantine-btn-mute-alerts"
        >
          Mute alerts
        </Button>
        <Text size="sm" c={muted ? 'green' : 'dimmed'}>
          {muted ? 'Alerts are muted' : 'Alerts are audible'}
        </Text>
        <Button
          onClick={handleTestAlert}
          fullWidth
          data-testid="mantine-btn-test-alert"
        >
          Send test alert
        </Button>
      </Stack>
    </Card>
  );
}
