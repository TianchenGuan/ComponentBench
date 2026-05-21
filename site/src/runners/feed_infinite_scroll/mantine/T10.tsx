'use client';

/**
 * feed_infinite_scroll-mantine-T10: Bottom-left archive: pin ARCH-150
 * 
 * Layout: isolated card anchored near the bottom-left of the viewport.
 * The card is titled "Archive" and contains a Mantine ScrollArea feed with infinite loading.
 * There are many items (ARCH-001 … ARCH-160). The target ARCH-150 is far down.
 * Each row has an ID and title on the left and a small pin ActionIcon on the right.
 * Unpinned rows show an outline pin; pinned rows show a filled pin and a 'Pinned' badge.
 * 
 * Success: item ARCH-150 has pinned=true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Group, Stack, ActionIcon, Badge, Loader, Box } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import { IconPin, IconPinFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  isPinned: boolean;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Completed migration',
    'Old backup',
    'Archived report',
    'Legacy data',
    'Past project',
    'Historical records',
    'Previous version',
    'Deprecated feature',
    'Closed ticket',
    'Finished task',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count && i <= 160; i++) {
    const id = `ARCH-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      isPinned: false, // All start unpinned
    });
  }
  return items;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 30));
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    const item = items.find(i => i.id === 'ARCH-150');
    if (!successCalledRef.current && item?.isPinned) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [items, onSuccess]);

  const handleTogglePin = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
    ));
  };

  // Scroll handler
  const handleScroll = useCallback((position: { x: number; y: number }) => {
    const container = viewportRef.current;
    if (!container) return;
    
    const { scrollHeight, clientHeight } = container;
    
    if (scrollHeight - position.y - clientHeight < 100 && !loading && items.length < 160) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 30)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      withBorder 
      style={{ width: 450 }}
    >
      <Text fw={600} size="lg" mb="md">Archive</Text>
      <ScrollArea
        h={400}
        viewportRef={viewportRef}
        onScrollPositionChange={handleScroll}
        data-testid="feed-Archive"
      >
        <Stack gap="xs">
          {items.map((item) => (
            <Paper
              key={item.id}
              data-item-id={item.id}
              data-pinned={item.isPinned}
              p="sm"
              withBorder
            >
              <Group justify="space-between">
                <Group gap="xs">
                  <Text fw={600} size="sm">{item.id}</Text>
                  <Text size="sm">{item.title}</Text>
                  {item.isPinned && (
                    <Badge size="xs" color="blue">Pinned</Badge>
                  )}
                </Group>
                <ActionIcon
                  variant={item.isPinned ? 'filled' : 'subtle'}
                  color={item.isPinned ? 'blue' : 'gray'}
                  size="sm"
                  onClick={(e) => handleTogglePin(item.id, e)}
                  title={item.isPinned ? 'Unpin' : 'Pin'}
                >
                  {item.isPinned ? <IconPinFilled size={14} /> : <IconPin size={14} />}
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
        {loading && (
          <Box ta="center" py="md">
            <Loader size="sm" />
          </Box>
        )}
      </ScrollArea>
    </Paper>
  );
}
