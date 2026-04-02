'use client';

/**
 * icon_button-mantine-T01: Activate Settings ActionIcon
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Preferences" shows one Mantine ActionIcon with a gear icon.
 * A visible text label "Settings" appears next to the ActionIcon.
 * 
 * Success: The ActionIcon with aria-label "Settings" has data-cb-activated="true".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Group, Box } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    if (activated) return;
    setActivated(true);
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Preferences
      </Text>
      <Group gap="sm">
        <ActionIcon
          variant="default"
          onClick={handleClick}
          aria-label="Settings"
          data-cb-activated={activated ? 'true' : 'false'}
          data-testid="mantine-action-icon-settings"
        >
          <IconSettings size={18} />
        </ActionIcon>
        <Text size="sm">Settings</Text>
      </Group>
      {activated && (
        <Text size="sm" c="green" mt="md">
          Settings opened
        </Text>
      )}
    </Card>
  );
}
