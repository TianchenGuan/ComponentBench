'use client';

/**
 * toggle_button-mantine-T21: Pin toggle on (Mantine Button)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 *
 * The card title is "Bookmark". It contains a Mantine Button used as a toggle button:
 * - Label: "Pin"
 * - aria-pressed is bound to the pressed state
 * - Visual styling uses a `data-active` modifier: Off = subtle/outline; On = filled
 *
 * Initial state: Off (aria-pressed=false). No other interactive elements are present.
 */

import React, { useState } from 'react';
import { Card, Button, Text } from '@mantine/core';
import { IconPin, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (newPressed) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Bookmark</Text>
      
      <Button
        variant={pressed ? 'filled' : 'outline'}
        leftSection={pressed ? <IconCheck size={16} /> : <IconPin size={16} />}
        onClick={handleClick}
        aria-pressed={pressed}
        data-active={pressed || undefined}
        data-testid="pin-toggle"
      >
        Pin
      </Button>

      <Text size="xs" c="dimmed" mt="md">
        Status: {pressed ? 'On' : 'Off'}
      </Text>
    </Card>
  );
}
