'use client';

/**
 * feed_infinite_scroll-mantine-T03: Changelog: back to top
 * 
 * Layout: isolated "Changelog" card centered.
 * Initial state: the ScrollArea is pre-scrolled (mid-list) with several pages loaded.
 * A small button labeled "Back to top" appears in the bottom-right corner of the feed.
 * Clicking it scrolls the ScrollArea viewport back to the top.
 * 
 * Success: scroll_top_px is 0 (within tolerance of 5px) and CHG-001 is visible
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Badge, Group, Stack, Button, Box } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  type: 'Fix' | 'Feature';
  timestamp: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `CHG-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: `Changelog entry ${i}`,
      type: Math.random() > 0.5 ? 'Fix' : 'Feature',
      timestamp: `${Math.floor(Math.random() * 30) + 1}d ago`,
    });
  }
  return items;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 60));
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [showBackToTop, setShowBackToTop] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);
  const initialScrollDoneRef = useRef(false);

  // Pre-scroll to middle on mount
  useEffect(() => {
    if (viewportRef.current && !initialScrollDoneRef.current) {
      viewportRef.current.scrollTop = 1500;
      setScrollPosition({ x: 0, y: 1500 });
      initialScrollDoneRef.current = true;
    }
  }, []);

  // Check for success condition
  const checkSuccess = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = viewportRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;
    
    if (currentScrollTop <= 5) {
      const firstItem = container.querySelector('[data-item-id="CHG-001"]');
      if (firstItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = firstItem.getBoundingClientRect();
        if (itemRect.top >= containerRect.top && itemRect.top < containerRect.bottom) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    }
  }, [onSuccess]);

  const handleScroll = useCallback((position: { x: number; y: number }) => {
    setScrollPosition(position);
    setShowBackToTop(position.y > 50);
    checkSuccess();
  }, [checkSuccess]);

  const handleBackToTop = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      withBorder 
      style={{ width: 500, position: 'relative' }}
    >
      <Text fw={600} size="lg" mb="md">Changelog</Text>
      <ScrollArea
        h={400}
        viewportRef={viewportRef}
        onScrollPositionChange={handleScroll}
        data-testid="feed-Changelog"
        data-scroll-top={scrollPosition.y}
        data-first-visible-item-id={scrollPosition.y <= 5 ? 'CHG-001' : undefined}
      >
        <Stack gap="xs">
          {items.map((item) => (
            <Paper
              key={item.id}
              data-item-id={item.id}
              p="sm"
              withBorder
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
      </ScrollArea>
      
      {showBackToTop && (
        <Button
          size="xs"
          leftSection={<IconArrowUp size={14} />}
          onClick={handleBackToTop}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
          }}
        >
          Back to top
        </Button>
      )}
    </Paper>
  );
}
