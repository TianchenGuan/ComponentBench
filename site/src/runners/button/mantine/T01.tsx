'use client';

/**
 * button-mantine-T01: Send invite (Mantine button click)
 * 
 * Baseline isolated card titled "Invite teammate".
 * Single Mantine Button labeled "Send invite".
 * When clicked, shows notification and button text changes to "Sent".
 */

import React, { useState } from 'react';
import { Button, Card, Text, Notification } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    onSuccess();
  };

  return (
    <div>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={500} size="lg" mb="md">
          Invite teammate
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Send an invitation to join your team workspace.
        </Text>
        <Button
          onClick={handleClick}
          disabled={clicked}
          fullWidth
          data-testid="mantine-btn-send-invite"
        >
          {clicked ? 'Sent' : 'Send invite'}
        </Button>
      </Card>
      {clicked && (
        <Notification title="Success" color="green" mt="md" withCloseButton={false}>
          Invite sent
        </Notification>
      )}
    </div>
  );
}
