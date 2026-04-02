'use client';

/**
 * toggle_button-mantine-T23: Disable live preview in settings panel
 *
 * Layout: settings_panel centered. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The panel section "Editor" contains one row labeled "Live preview".
 * The control is a Mantine Button behaving as a toggle button:
 * - Label: "Live preview"
 * - On = filled/active styling with aria-pressed=true
 * - Off = outline/subtle styling with aria-pressed=false
 *
 * Initial state: On. No Save/Apply action is required.
 */

import React, { useState } from 'react';
import { Card, Text, Button, Group, Box, NavLink } from '@mantine/core';
import { IconSettings, IconEye, IconLock, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(true); // Initial: On

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (!newPressed) {
      // Success when turned OFF
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding={0} radius="md" withBorder style={{ width: 600 }}>
      <Group wrap="nowrap" gap={0} align="stretch">
        {/* Sidebar */}
        <Box style={{ width: 160, borderRight: '1px solid var(--mantine-color-gray-3)' }} p="sm">
          <NavLink label="General" leftSection={<IconSettings size={16} />} />
          <NavLink label="Editor" leftSection={<IconEye size={16} />} active />
          <NavLink label="Privacy" leftSection={<IconLock size={16} />} />
        </Box>

        {/* Main content */}
        <Box p="lg" style={{ flex: 1 }}>
          <Text size="xs" c="dimmed" mb="xs">Settings ▸ Editor</Text>
          
          <Group justify="space-between" align="center">
            <Box>
              <Text fw={500}>Live preview</Text>
              <Text size="xs" c="dimmed">
                Live preview: {pressed ? 'On' : 'Off'}
              </Text>
            </Box>
            <Button
              variant={pressed ? 'filled' : 'outline'}
              leftSection={pressed ? <IconCheck size={16} /> : <IconEye size={16} />}
              onClick={handleClick}
              aria-pressed={pressed}
              data-testid="live-preview-toggle"
            >
              Live preview
            </Button>
          </Group>
        </Box>
      </Group>
    </Card>
  );
}
