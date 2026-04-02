'use client';

/**
 * toggle_button-mantine-T22: Like heart ActionIcon on
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 *
 * The card is titled "Reaction". It contains a single Mantine ActionIcon rendered as a toggle button:
 * - Icon: heart
 * - aria-label: "Like"
 * - aria-pressed indicates state
 * - Off = light/subtle styling; On = filled styling (often with a stronger background)
 *
 * A small text label under the icon reads "Like: Off/On" for feedback.
 * Initial state: Off.
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
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
      <Text fw={500} size="lg" mb="md">Reaction</Text>
      
      <ActionIcon
        variant={pressed ? 'filled' : 'subtle'}
        color={pressed ? 'red' : 'gray'}
        size="lg"
        onClick={handleClick}
        aria-pressed={pressed}
        aria-label="Like"
        data-testid="like-toggle"
      >
        {pressed ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
      </ActionIcon>

      <Text size="xs" c="dimmed" mt="md">
        Like: {pressed ? 'On' : 'Off'}
      </Text>
    </Card>
  );
}
