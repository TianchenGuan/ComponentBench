'use client';

/**
 * feed_infinite_scroll-mantine-T01: Changelog: scroll to CHG-014
 * 
 * Layout: isolated card centered on the page titled "Changelog".
 * The feed uses Mantine ScrollArea to provide an internal scroll container.
 * Initial state: first 30 changelog entries are loaded, with ~8 visible at a time.
 * Rows are visually consistent: each has an ID, a short title, and a small Badge.
 * Infinite loading exists but CHG-014 is in the initially loaded set.
 * 
 * Success: CHG-014 is visible within the ScrollArea viewport (min_visible_ratio: 0.5)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Badge, Group, Stack, Loader, Box } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  type: 'Fix' | 'Feature';
  timestamp: string;
}

const CHANGELOG_TITLES: Record<number, string> = {
  1: 'Initial release',
  2: 'Bug fixes',
  3: 'Performance improvements',
  4: 'New dashboard',
  5: 'API updates',
  6: 'Security patches',
  7: 'UI redesign',
  8: 'Mobile support',
  9: 'Dark mode',
  10: 'Export functionality',
  11: 'Search improvements',
  12: 'Notification system',
  13: 'Settings page',
  14: 'Added export button',
  15: 'Fixed login issue',
  16: 'Enhanced filters',
  17: 'Updated icons',
  18: 'Improved loading',
  19: 'Cache optimization',
  20: 'Error handling',
  21: 'Accessibility fixes',
  22: 'Keyboard shortcuts',
  23: 'Batch operations',
  24: 'Audit logging',
  25: 'Rate limiting',
  26: 'Webhooks support',
  27: 'API versioning',
  28: 'Documentation update',
  29: 'Analytics dashboard',
  30: 'Custom themes',
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
    });
  }
  return items;
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 30));
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check if target item is visible
  const checkVisibility = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = viewportRef.current;
    if (!container) return;

    const targetElement = container.querySelector('[data-item-id="CHG-014"]');
    if (!targetElement) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const visibleTop = Math.max(containerRect.top, targetRect.top);
    const visibleBottom = Math.min(containerRect.bottom, targetRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio = visibleHeight / targetRect.height;

    if (visibilityRatio >= 0.5) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [onSuccess]);

  // Scroll handler
  const handleScroll = useCallback((position: { x: number; y: number }) => {
    checkVisibility();
    
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
  }, [loading, items.length, checkVisibility]);

  useEffect(() => {
    checkVisibility();
  }, [checkVisibility]);

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Changelog</Text>
      <ScrollArea
        h={400}
        viewportRef={viewportRef}
        onScrollPositionChange={handleScroll}
        data-testid="feed-Changelog"
      >
        <Stack gap="xs">
          {items.map((item) => (
            <Paper
              key={item.id}
              data-item-id={item.id}
              p="sm"
              withBorder
              style={{ cursor: 'default' }}
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
