'use client';

/**
 * breadcrumb-mantine-T05: Navigate in dark Mantine panel
 * 
 * Dark theme settings panel.
 * Mantine Breadcrumbs: Settings > Notifications > Email
 * "Email" is current. Click "Notifications" to navigate.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Notifications') {
      onSuccess();
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      style={{
        width: 450,
        background: '#1a1b1e',
        border: '1px solid #2c2e33',
      }}
    >
      <Text size="lg" fw={600} mb="md" c="white">
        Email Settings
      </Text>
      
      <Breadcrumbs mb="md" separator="›">
        <Anchor
          component="button"
          onClick={() => handleNavigate('Settings')}
          data-testid="mantine-breadcrumb-settings"
          style={{ cursor: 'pointer', color: '#74c0fc' }}
        >
          Settings
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Notifications')}
          data-testid="mantine-breadcrumb-notifications"
          style={{ cursor: 'pointer', color: '#74c0fc' }}
        >
          Notifications
        </Anchor>
        <Text c="dimmed" data-testid="mantine-breadcrumb-email">
          Email
        </Text>
      </Breadcrumbs>

      {navigated ? (
        <Text c="green" fw={500}>
          You navigated to: {navigated}
        </Text>
      ) : (
        <Text c="dimmed">
          Email notification settings. Use breadcrumb to navigate.
        </Text>
      )}
    </Card>
  );
}
