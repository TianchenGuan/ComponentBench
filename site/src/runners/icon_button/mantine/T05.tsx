'use client';

/**
 * icon_button-mantine-T05: Match target icon (ActionIcon) near top-left
 *
 * Layout: isolated_card placed near the top-left of the viewport.
 * A card titled "Icon match" with a Target icon reference and four ActionIcons in a 2×2 grid.
 * 
 * Success: The correct ActionIcon (matching the target icon) has data-cb-activated="true".
 */

import React, { useState, useMemo } from 'react';
import { Card, Text, ActionIcon, Box, SimpleGrid } from '@mantine/core';
import { IconBell, IconFlag, IconTag, IconBookmark } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

const ICONS = [
  { key: 'bell', icon: <IconBell size={18} /> },
  { key: 'flag', icon: <IconFlag size={18} /> },
  { key: 'tag', icon: <IconTag size={18} /> },
  { key: 'bookmark', icon: <IconBookmark size={18} /> },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const targetKey = useMemo(() => 'flag', []);
  const [activatedKey, setActivatedKey] = useState<string | null>(null);

  const handleClick = (key: string) => {
    if (activatedKey) return;
    setActivatedKey(key);
    if (key === targetKey) {
      onSuccess();
    }
  };

  const targetIcon = ICONS.find(i => i.key === targetKey)?.icon;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
      <Text fw={500} size="lg" mb="md">
        Icon match
      </Text>

      {/* Target reference */}
      <Box mb="lg">
        <Text size="xs" c="dimmed" mb="xs">Target icon:</Text>
        <Box 
          style={{ 
            width: 40, 
            height: 40, 
            border: '2px dashed var(--mantine-color-blue-5)', 
            borderRadius: 6, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}
        >
          {targetIcon}
        </Box>
      </Box>

      {/* Options */}
      <Text size="xs" c="dimmed" mb="xs">Options:</Text>
      <SimpleGrid cols={2} spacing="xs">
        {ICONS.map((item, index) => (
          <ActionIcon
            key={item.key}
            variant={activatedKey === item.key ? 'filled' : 'default'}
            size="lg"
            onClick={() => handleClick(item.key)}
            aria-label={`Option ${index + 1}`}
            data-cb-activated={activatedKey === item.key ? 'true' : 'false'}
          >
            {item.icon}
          </ActionIcon>
        ))}
      </SimpleGrid>
    </Card>
  );
}
