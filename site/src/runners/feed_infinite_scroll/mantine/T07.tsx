'use client';

/**
 * feed_infinite_scroll-mantine-T07: Two timelines: open EVT-077 in Secondary
 * 
 * Layout: isolated_card with two stacked timeline feeds.
 * Top feed label: "Primary timeline". Bottom feed label: "Secondary timeline".
 * Both are Mantine ScrollArea components with infinite loading.
 * Spacing mode is compact: rows have reduced padding and smaller click targets.
 * EVT-077 is not in the first viewport of the Secondary timeline.
 * 
 * Success: active_item_id equals EVT-077 and expanded is true (in Secondary timeline)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Group, Stack, Loader, Box, Collapse } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  details: string;
}

function generateEvents(start: number, count: number): FeedItem[] {
  const titles = [
    'Database failover',
    'Service restarted',
    'Config updated',
    'Rolled back',
    'Scaled up',
    'Maintenance started',
    'Cache cleared',
    'Backup completed',
    'Health check passed',
    'Alert resolved',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `EVT-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 60) + 1}m ago`,
      details: `Event details for ${id}: Operation completed. Duration: ${Math.floor(Math.random() * 300)}ms. Affected services: none.`,
    });
  }
  return items;
}

interface TimelineFeedProps {
  title: string;
  testId: string;
  items: FeedItem[];
  loading: boolean;
  onScroll: (position: { x: number; y: number }) => void;
  activeItemId: string | null;
  onItemClick: (id: string) => void;
  viewportRef: React.RefObject<HTMLDivElement>;
}

function TimelineFeed({ title, testId, items, loading, onScroll, activeItemId, onItemClick, viewportRef }: TimelineFeedProps) {
  return (
    <Paper shadow="sm" p="sm" withBorder data-testid={testId} data-active-item-id={activeItemId}>
      <Text fw={600} size="md" mb="sm">{title}</Text>
      <ScrollArea
        h={200}
        viewportRef={viewportRef}
        onScrollPositionChange={onScroll}
      >
        <Stack gap={4}>
          {items.map((item) => (
            <Box key={item.id}>
              <Paper
                data-item-id={item.id}
                aria-expanded={activeItemId === item.id}
                p="xs"
                withBorder
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: activeItemId === item.id ? 'var(--mantine-color-blue-light)' : undefined,
                }}
                onClick={() => onItemClick(item.id)}
              >
                <Group gap="xs">
                  <Text fw={600} size="xs">{item.id}</Text>
                  <Text size="xs">{item.title}</Text>
                </Group>
                <Text size="xs" c="dimmed">{item.timestamp}</Text>
              </Paper>
              <Collapse in={activeItemId === item.id}>
                <Paper
                  data-expanded-for={item.id}
                  p="xs"
                  style={{ 
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    borderRadius: '0 0 4px 4px',
                  }}
                  withBorder
                >
                  <Text size="xs" c="dimmed">{item.details}</Text>
                </Paper>
              </Collapse>
            </Box>
          ))}
        </Stack>
        {loading && (
          <Box ta="center" py="xs">
            <Loader size="xs" />
          </Box>
        )}
      </ScrollArea>
    </Paper>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [primaryItems, setPrimaryItems] = useState<FeedItem[]>(() => generateEvents(1, 20));
  const [secondaryItems, setSecondaryItems] = useState<FeedItem[]>(() => generateEvents(1, 20));
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [primaryActiveId, setPrimaryActiveId] = useState<string | null>(null);
  const [secondaryActiveId, setSecondaryActiveId] = useState<string | null>(null);
  const primaryViewportRef = useRef<HTMLDivElement>(null);
  const secondaryViewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && secondaryActiveId === 'EVT-077') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [secondaryActiveId, onSuccess]);

  const handlePrimaryScroll = useCallback((position: { x: number; y: number }) => {
    const container = primaryViewportRef.current;
    if (!container) return;
    
    const { scrollHeight, clientHeight } = container;
    
    if (scrollHeight - position.y - clientHeight < 100 && !primaryLoading && primaryItems.length < 100) {
      setPrimaryLoading(true);
      setTimeout(() => {
        setPrimaryItems(prev => [...prev, ...generateEvents(prev.length + 1, 10)]);
        setPrimaryLoading(false);
      }, 500);
    }
  }, [primaryLoading, primaryItems.length]);

  const handleSecondaryScroll = useCallback((position: { x: number; y: number }) => {
    const container = secondaryViewportRef.current;
    if (!container) return;
    
    const { scrollHeight, clientHeight } = container;
    
    if (scrollHeight - position.y - clientHeight < 100 && !secondaryLoading && secondaryItems.length < 100) {
      setSecondaryLoading(true);
      setTimeout(() => {
        setSecondaryItems(prev => [...prev, ...generateEvents(prev.length + 1, 10)]);
        setSecondaryLoading(false);
      }, 500);
    }
  }, [secondaryLoading, secondaryItems.length]);

  return (
    <Stack gap="md" style={{ width: 500 }}>
      <TimelineFeed
        title="Primary timeline"
        testId="feed-PrimaryTimeline"
        items={primaryItems}
        loading={primaryLoading}
        onScroll={handlePrimaryScroll}
        activeItemId={primaryActiveId}
        onItemClick={(id) => setPrimaryActiveId(prev => prev === id ? null : id)}
        viewportRef={primaryViewportRef as React.RefObject<HTMLDivElement>}
      />
      
      <TimelineFeed
        title="Secondary timeline"
        testId="feed-SecondaryTimeline"
        items={secondaryItems}
        loading={secondaryLoading}
        onScroll={handleSecondaryScroll}
        activeItemId={secondaryActiveId}
        onItemClick={(id) => setSecondaryActiveId(prev => prev === id ? null : id)}
        viewportRef={secondaryViewportRef as React.RefObject<HTMLDivElement>}
      />
    </Stack>
  );
}
