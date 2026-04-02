'use client';

/**
 * feed_infinite_scroll-mantine-T09: Dark pins: match reference dot and select PIN-066
 * 
 * Theme: dark.
 * Layout: isolated card titled "Pinned Items" centered on the page.
 * Above the feed is a small "Reference dot" preview: a single colored circle.
 * Each feed row begins with a small colored dot. The text labels are intentionally similar.
 * The matching item is not in the first viewport and requires scrolling/lazy-loading.
 * Clicking a row selects it and highlights the row.
 * 
 * Success: matched_item_id equals PIN-066 (which has the matching dot color)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Group, Stack, Loader, Box } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

// Dot colors
const DOT_COLORS = ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2', '#f5222d'];
const TARGET_COLOR = '#13c2c2'; // Cyan - the reference color

interface FeedItem {
  id: string;
  title: string;
  dotColor: string;
  isTarget: boolean;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Reminder',
    'Quick note',
    'Important',
    'Follow up',
    'Action item',
    'Reference',
    'Bookmark',
    'To review',
    'Saved item',
    'Pinned note',
  ];

  const nonTargetColors = DOT_COLORS.filter(c => c !== TARGET_COLOR);

  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `PIN-${String(i).padStart(3, '0')}`;
    const isTarget = i === 66;

    const dotColor = isTarget
      ? TARGET_COLOR
      : nonTargetColors[Math.floor(seededRandom(i) * nonTargetColors.length)];

    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      dotColor,
      isTarget,
    });
  }
  return items;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 30));
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && selectedId === 'PIN-066') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [selectedId, onSuccess]);

  // Scroll handler
  const handleScroll = useCallback((position: { x: number; y: number }) => {
    const container = viewportRef.current;
    if (!container) return;
    
    const { scrollHeight, clientHeight } = container;
    
    if (scrollHeight - position.y - clientHeight < 100 && !loading && items.length < 100) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 20)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      withBorder 
      style={{ 
        width: 500, 
        backgroundColor: '#1f1f1f',
        borderColor: '#303030',
      }}
    >
      <Text fw={600} size="lg" mb="md" c="white">Pinned Items</Text>
      
      {/* Reference dot */}
      <Box 
        data-reference-id="REF-DOT-1"
        mb="md"
        p="sm"
        style={{ 
          backgroundColor: '#303030',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text size="xs" c="dimmed">Reference dot:</Text>
        <Box 
          style={{ 
            width: 20, 
            height: 20, 
            borderRadius: '50%',
            backgroundColor: TARGET_COLOR,
          }} 
        />
      </Box>

      <ScrollArea
        h={350}
        viewportRef={viewportRef}
        onScrollPositionChange={handleScroll}
        data-testid="feed-PinnedItems"
        data-selected-item-id={selectedId}
      >
        <Stack gap="xs">
          {items.map((item) => (
            <Paper
              key={item.id}
              data-item-id={item.id}
              data-dot={item.dotColor.replace('#', '')}
              p="sm"
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedId === item.id ? 'rgba(19, 194, 194, 0.2)' : '#262626',
                border: selectedId === item.id ? '2px solid #13c2c2' : '1px solid #303030',
                borderRadius: 8,
              }}
              onClick={() => setSelectedId(item.id)}
            >
              <Group gap="sm">
                <Box 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%',
                    backgroundColor: item.dotColor,
                    flexShrink: 0,
                  }} 
                />
                <Text fw={600} size="sm" c="white">{item.id}</Text>
                <Text size="sm" c="#888">{item.title}</Text>
              </Group>
            </Paper>
          ))}
        </Stack>
        {loading && (
          <Box ta="center" py="md">
            <Loader size="sm" color="gray" />
          </Box>
        )}
      </ScrollArea>
    </Paper>
  );
}
