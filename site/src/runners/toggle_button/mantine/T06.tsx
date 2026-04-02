'use client';

/**
 * toggle_button-mantine-T26: Restore spellcheck to default (on)
 *
 * Layout: settings_panel centered. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * In "Writing" settings there is a row labeled "Spellcheck".
 * - The control is a Mantine Button used as a toggle button labeled "Spellcheck".
 * - A small secondary button/link labeled "Restore default" appears to the right of the row.
 * - Helper caption: "Default: On".
 *
 * Initial state: Spellcheck is Off (aria-pressed=false), meaning it differs from default.
 * Clicking "Restore default" sets Spellcheck to On and shows a subtle toast "Restored to default".
 * Manually toggling Spellcheck On also produces the same final state.
 */

import React, { useState } from 'react';
import { Card, Text, Button, Group, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTextSpellcheck, IconCheck, IconRefresh } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false); // Initial: Off (not at default)

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (newPressed) {
      onSuccess();
    }
  };

  const handleRestore = () => {
    setPressed(true);
    notifications.show({
      title: 'Settings',
      message: 'Restored to default',
      autoClose: 3000,
    });
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text size="xs" c="dimmed" mb="xs">Settings ▸ Writing</Text>
      <Text fw={500} size="lg" mb="md">Writing settings</Text>
      
      <Group justify="space-between" align="center">
        <Box>
          <Text fw={500}>Spellcheck</Text>
          <Text size="xs" c="dimmed">Default: On</Text>
        </Box>
        <Group gap="xs">
          <Button
            variant={pressed ? 'filled' : 'outline'}
            leftSection={pressed ? <IconCheck size={16} /> : <IconTextSpellcheck size={16} />}
            onClick={handleClick}
            aria-pressed={pressed}
            data-testid="spellcheck-toggle"
          >
            {pressed ? 'On' : 'Off'}
          </Button>
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconRefresh size={14} />}
            onClick={handleRestore}
          >
            Restore default
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
