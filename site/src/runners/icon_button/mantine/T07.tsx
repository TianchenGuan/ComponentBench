'use client';

/**
 * icon_button-mantine-T07: Bookmark the Secondary item (two instances)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Bookmarks" lists two items: "Primary item" and "Secondary item".
 * Each row ends with a bookmark ActionIcon.
 * 
 * Success: The bookmark ActionIcon for "Secondary item" has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Group, Box, Badge } from '@mantine/core';
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

interface Item {
  id: string;
  name: string;
  description: string;
}

const items: Item[] = [
  { id: 'primary', name: 'Primary item', description: 'This is the first item in the list' },
  { id: 'secondary', name: 'Secondary item', description: 'This is the second item in the list' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (id === 'secondary') {
          onSuccess();
        }
      }
      return next;
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Bookmarks
      </Text>

      {items.map((item) => {
        const isBookmarked = bookmarked.has(item.id);
        return (
          <Box
            key={item.id}
            style={{ 
              borderBottom: '1px solid var(--mantine-color-gray-3)', 
              paddingBottom: 12, 
              marginBottom: 12 
            }}
          >
            <Group justify="space-between" align="flex-start">
              <Box>
                <Group gap="xs">
                  <Text size="sm" fw={500}>{item.name}</Text>
                  {isBookmarked && (
                    <Badge size="xs" color="green">Saved</Badge>
                  )}
                </Group>
                <Text size="xs" c="dimmed" mt={4}>
                  {item.description}
                </Text>
              </Box>
              <ActionIcon
                variant={isBookmarked ? 'filled' : 'default'}
                color={isBookmarked ? 'blue' : undefined}
                onClick={() => handleToggle(item.id)}
                aria-label={`Bookmark ${item.name}`}
                aria-pressed={isBookmarked}
                data-testid={`mantine-action-icon-bookmark-${item.id}`}
              >
                {isBookmarked ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}
              </ActionIcon>
            </Group>
          </Box>
        );
      })}
    </Card>
  );
}
