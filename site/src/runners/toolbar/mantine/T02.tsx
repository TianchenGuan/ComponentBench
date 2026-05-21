'use client';

/**
 * toolbar-mantine-T02: Toggle Favorite on in icon toolbar
 *
 * A centered isolated card contains a toolbar labeled "Item tools" built with a 
 * Mantine Group of three ActionIcon controls: Favorite (heart), Pin, and Mute.
 * Each ActionIcon has an accessible name via title/aria-label and visually indicates 
 * pressed state when active. A small text line under the toolbar reads "Favorite: Off/On".
 */

import React, { useState } from 'react';
import { Paper, Group, ActionIcon, Text, Title, Tooltip } from '@mantine/core';
import { IconHeart, IconPin, IconVolume3 } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToggleState {
  favorite: boolean;
  pin: boolean;
  mute: boolean;
}

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleState>({
    favorite: false,
    pin: false,
    mute: false,
  });

  const handleToggle = (key: keyof ToggleState) => {
    const newState = { ...toggles, [key]: !toggles[key] };
    setToggles(newState);
    if (key === 'favorite' && newState.favorite) {
      onSuccess();
    }
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 350 }}>
      <Title order={5} mb="md">
        Item tools
      </Title>

      <Group gap="xs" mb="md" data-testid="mantine-toolbar-item-tools">
        <Tooltip label="Favorite">
          <ActionIcon
            variant={toggles.favorite ? 'filled' : 'default'}
            color={toggles.favorite ? 'red' : 'gray'}
            onClick={() => handleToggle('favorite')}
            aria-pressed={toggles.favorite}
            aria-label="Favorite"
            title="Favorite"
            data-testid="mantine-toolbar-item-tools-favorite"
          >
            <IconHeart size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Pin">
          <ActionIcon
            variant={toggles.pin ? 'filled' : 'default'}
            color={toggles.pin ? 'blue' : 'gray'}
            onClick={() => handleToggle('pin')}
            aria-pressed={toggles.pin}
            aria-label="Pin"
            title="Pin"
            data-testid="mantine-toolbar-item-tools-pin"
          >
            <IconPin size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Mute">
          <ActionIcon
            variant={toggles.mute ? 'filled' : 'default'}
            color={toggles.mute ? 'gray' : 'gray'}
            onClick={() => handleToggle('mute')}
            aria-pressed={toggles.mute}
            aria-label="Mute"
            title="Mute"
            data-testid="mantine-toolbar-item-tools-mute"
          >
            <IconVolume3 size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Text size="sm" c="dimmed">
        Favorite: {toggles.favorite ? 'On' : 'Off'}
      </Text>
    </Paper>
  );
}
