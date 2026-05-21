'use client';

/**
 * feed_infinite_scroll-mantine-T02: Changelog: expand CHG-006 details
 * 
 * Layout: isolated "Changelog" card centered on the page.
 * The list is inside a Mantine ScrollArea; each item is a clickable Paper row.
 * Clicking a row expands an inline details section under it.
 * Only one entry can be expanded at a time.
 * CHG-006 is in the initial loaded items and is reachable with little scrolling.
 * 
 * Success: active_item_id equals CHG-006 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Badge, Group, Stack, Loader, Box, Collapse } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  type: 'Fix' | 'Feature';
  timestamp: string;
  notes: string;
}

const CHANGELOG_TITLES: Record<number, string> = {
  1: 'Initial release',
  2: 'Bug fixes',
  3: 'Performance improvements',
  4: 'New dashboard',
  5: 'API updates',
  6: 'Improved keyboard shortcuts',
  7: 'UI redesign',
  8: 'Mobile support',
  9: 'Dark mode',
  10: 'Export functionality',
  11: 'Search improvements',
  12: 'Notification system',
};

function generateItems(start: number, count: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `CHG-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: CHANGELOG_TITLES[i] || `Changelog entry ${i}`,
      type: Math.random() > 0.5 ? 'Fix' : 'Feature',
      timestamp: `${Math.floor(Math.random() * 30) + 1}d ago`,
      notes: `Notes for ${id}: This update includes various improvements and bug fixes. Users should update to this version for the best experience.`,
    });
  }
  return items;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'CHG-006') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeItemId, onSuccess]);

  const handleItemClick = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };

  // Scroll handler
  const handleScroll = useCallback((position: { x: number; y: number }) => {
    const container = viewportRef.current;
    if (!container) return;
    
    const { scrollHeight, clientHeight } = container;
    
    if (scrollHeight - position.y - clientHeight < 100 && !loading && items.length < 100) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      withBorder 
      style={{ width: 500 }}
      data-active-item-id={activeItemId}
    >
      <Text fw={600} size="lg" mb="md">Changelog</Text>
      <ScrollArea
        h={400}
        viewportRef={viewportRef}
        onScrollPositionChange={handleScroll}
        data-testid="feed-Changelog"
      >
        <Stack gap="xs">
          {items.map((item) => (
            <Box key={item.id}>
              <Paper
                data-item-id={item.id}
                aria-expanded={activeItemId === item.id}
                p="sm"
                withBorder
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: activeItemId === item.id ? 'var(--mantine-color-blue-light)' : undefined,
                }}
                onClick={() => handleItemClick(item.id)}
              >
                <Group justify="space-between">
                  <Group gap="xs">
                    <Text fw={600} size="sm">{item.id}</Text>
                    <Text size="sm">{item.title}</Text>
                  </Group>
                  <Badge 
                    color={item.type === 'Fix' ? 'red' : 'blue'} 
                    size="sm"
                  >
                    {item.type}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" mt={4}>{item.timestamp}</Text>
              </Paper>
              <Collapse in={activeItemId === item.id}>
                <Paper
                  data-expanded-for={item.id}
                  p="sm"
                  style={{ 
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    borderTop: 'none',
                    borderRadius: '0 0 4px 4px',
                  }}
                  withBorder
                >
                  <Text size="xs" fw={600} mb={4}>Notes</Text>
                  <Text size="sm" c="dimmed">{item.notes}</Text>
                </Paper>
              </Collapse>
            </Box>
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
