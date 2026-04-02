'use client';

/**
 * icon_button-mantine-T02: Toggle Like On (heart ActionIcon)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Post" displays "Release notes". A Mantine ActionIcon showing a heart icon.
 * 
 * Success: The Like ActionIcon has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Group, Box } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [liked, setLiked] = useState(false);

  const handleToggle = () => {
    const newState = !liked;
    setLiked(newState);
    if (newState) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Post
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        &quot;Release notes&quot;
      </Text>
      <Group justify="space-between">
        <Text size="sm">Like: {liked ? 'On' : 'Off'}</Text>
        <ActionIcon
          variant={liked ? 'filled' : 'default'}
          color={liked ? 'red' : undefined}
          onClick={handleToggle}
          aria-label="Like"
          aria-pressed={liked}
          data-testid="mantine-action-icon-like"
        >
          {liked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
        </ActionIcon>
      </Group>
    </Card>
  );
}
