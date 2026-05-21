'use client';

/**
 * feed_infinite_scroll-mantine-T04: Settings panel: show Errors only
 * 
 * Layout: settings_panel. The page is split into a left settings column and
 * a right panel containing the "Event Feed".
 * The Event Feed is an infinite-scrolling list inside a Mantine ScrollArea.
 * In the feed header there is a SegmentedControl with options "All" and "Errors only".
 * When switched to "Errors only", the list updates to show only error events.
 * 
 * Success: filters.mode equals 'errors_only'
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Badge, Group, Stack, Switch, TextInput, Select, SegmentedControl, Loader, Box } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'System started',
    'User logged in',
    'Database connection failed',
    'Cache cleared',
    'API timeout',
    'File uploaded',
    'Permission denied',
    'Task completed',
    'Memory warning',
    'Config updated',
  ];
  
  const types: ('info' | 'warning' | 'error')[] = ['info', 'warning', 'error'];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `EVT-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      type: types[Math.floor(Math.random() * types.length)],
      timestamp: `${Math.floor(Math.random() * 60) + 1}m ago`,
    });
  }
  return items;
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 30));
  const [loading, setLoading] = useState(false);
  const [filterMode, setFilterMode] = useState('all');
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && filterMode === 'errors_only') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [filterMode, onSuccess]);

  const filteredItems = filterMode === 'errors_only' 
    ? items.filter(item => item.type === 'error')
    : items;

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
    <Group align="flex-start" gap="lg" style={{ width: 800 }}>
      {/* Left column - settings (clutter) */}
      <Paper shadow="sm" p="md" withBorder style={{ width: 280 }}>
        <Text fw={600} size="lg" mb="md">Settings</Text>
        <Stack gap="md">
          <TextInput label="Application name" placeholder="Enter name" />
          <Select 
            label="Log level" 
            placeholder="Select level"
            data={['Debug', 'Info', 'Warning', 'Error']}
          />
          <Switch label="Enable notifications" />
          <Switch label="Auto-refresh" defaultChecked />
        </Stack>
      </Paper>

      {/* Right column - Event Feed */}
      <Paper 
        shadow="sm" 
        p="md" 
        withBorder 
        style={{ flex: 1 }}
        data-filter-mode={filterMode}
      >
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <Text fw={600} size="lg">Event Feed</Text>
            {filterMode === 'errors_only' && (
              <Badge color="red" size="sm">Errors</Badge>
            )}
          </Group>
          <SegmentedControl
            size="xs"
            value={filterMode}
            onChange={setFilterMode}
            data={[
              { label: 'All', value: 'all' },
              { label: 'Errors only', value: 'errors_only' },
            ]}
          />
        </Group>
        <ScrollArea
          h={350}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
          data-testid="feed-EventFeed"
        >
          <Stack gap="xs">
            {filteredItems.map((item) => (
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
                    color={item.type === 'error' ? 'red' : item.type === 'warning' ? 'yellow' : 'blue'} 
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
    </Group>
  );
}
