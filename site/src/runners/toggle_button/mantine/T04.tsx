'use client';

/**
 * toggle_button-mantine-T24: Star the Secondary workspace (2 ActionIcon toggles)
 *
 * Layout: form_section centered. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The section is titled "Workspaces" and lists two rows:
 * - "Primary workspace" with a star ActionIcon toggle on the right
 * - "Secondary workspace" with a star ActionIcon toggle on the right
 *
 * Both star controls are Mantine ActionIcons with:
 * - aria-label "Star — Primary workspace" / "Star — Secondary workspace"
 * - aria-pressed bound to state
 * - Off = subtle style; On = filled style
 *
 * Initial state: both stars are Off.
 * Target: the star toggle for "Secondary workspace" only.
 */

import React, { useState } from 'react';
import { Card, Text, Group, Box, ActionIcon, Divider } from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryStarred, setPrimaryStarred] = useState(false);
  const [secondaryStarred, setSecondaryStarred] = useState(false);

  const handlePrimary = () => {
    setPrimaryStarred(!primaryStarred);
    // Does not trigger success
  };

  const handleSecondary = () => {
    const newStarred = !secondaryStarred;
    setSecondaryStarred(newStarred);
    if (newStarred) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Workspaces</Text>
      
      {/* Primary workspace */}
      <Group justify="space-between" align="center" mb="sm">
        <Box>
          <Text fw={500}>Primary workspace</Text>
          <Text size="xs" c="dimmed">Star: {primaryStarred ? 'On' : 'Off'}</Text>
        </Box>
        <ActionIcon
          variant={primaryStarred ? 'filled' : 'subtle'}
          color={primaryStarred ? 'yellow' : 'gray'}
          size="lg"
          onClick={handlePrimary}
          aria-pressed={primaryStarred}
          aria-label="Star — Primary workspace"
          data-testid="star-primary"
        >
          {primaryStarred ? <IconStarFilled size={20} /> : <IconStar size={20} />}
        </ActionIcon>
      </Group>

      <Divider my="sm" />

      {/* Secondary workspace - TARGET */}
      <Group justify="space-between" align="center">
        <Box>
          <Text fw={500}>Secondary workspace</Text>
          <Text size="xs" c="dimmed">Star: {secondaryStarred ? 'On' : 'Off'}</Text>
        </Box>
        <ActionIcon
          variant={secondaryStarred ? 'filled' : 'subtle'}
          color={secondaryStarred ? 'yellow' : 'gray'}
          size="lg"
          onClick={handleSecondary}
          aria-pressed={secondaryStarred}
          aria-label="Star — Secondary workspace"
          data-testid="star-secondary"
        >
          {secondaryStarred ? <IconStarFilled size={20} /> : <IconStar size={20} />}
        </ActionIcon>
      </Group>
    </Card>
  );
}
