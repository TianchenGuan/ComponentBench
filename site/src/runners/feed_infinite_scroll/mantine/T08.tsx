'use client';

/**
 * feed_infinite_scroll-mantine-T08: Dashboard triage: apply 4 alerts
 * 
 * Layout: dashboard with several widgets creating medium clutter.
 * One widget is the "Alert Triage" card containing an infinite-scrolling feed
 * inside a Mantine ScrollArea.
 * Each row has a checkbox, an alert ID (ALR-###), and a short description.
 * Selection is staged: checked boxes update a "Selected (pending)" count;
 * selection is committed only when the footer button "Apply" is clicked.
 * 
 * Success: committed_selected_item_ids equals [ALR-012, ALR-018, ALR-021, ALR-024]
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Group, Stack, Checkbox, Button, Loader, Box, Card } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
}

function generateAlerts(start: number, count: number): FeedItem[] {
  const titles = [
    'High CPU usage',
    'Memory warning',
    'Disk space low',
    'Network timeout',
    'API error rate',
    'Service degraded',
    'Connection failed',
    'Queue backlog',
    'Cache miss rate',
    'Health check failed',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `ALR-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
    });
  }
  return items;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateAlerts(1, 30));
  const [loading, setLoading] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<Set<string>>(new Set());
  const [committedSelection, setCommittedSelection] = useState<string[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (successCalledRef.current) return;
    
    const targetIds = ['ALR-012', 'ALR-018', 'ALR-021', 'ALR-024'];
    const isMatch = committedSelection.length === 4 &&
      targetIds.every(id => committedSelection.includes(id));
    
    if (isMatch) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [committedSelection, onSuccess]);

  const handleToggle = (id: string) => {
    setPendingSelection(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApply = () => {
    setCommittedSelection(Array.from(pendingSelection));
  };

  // Scroll handler
  const handleScroll = useCallback((position: { x: number; y: number }) => {
    const container = viewportRef.current;
    if (!container) return;
    
    const { scrollHeight, clientHeight } = container;
    
    if (scrollHeight - position.y - clientHeight < 100 && !loading && items.length < 50) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateAlerts(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Group align="flex-start" gap="md" style={{ width: 800 }}>
      {/* Dashboard widgets (clutter) */}
      <Stack gap="md" style={{ width: 200 }}>
        <Card shadow="sm" padding="sm" withBorder>
          <Text size="xs" c="dimmed">Active Incidents</Text>
          <Text fw={700} size="xl">12</Text>
        </Card>
        <Card shadow="sm" padding="sm" withBorder>
          <Text size="xs" c="dimmed">Resolved Today</Text>
          <Text fw={700} size="xl">28</Text>
        </Card>
        <Card shadow="sm" padding="sm" withBorder>
          <Text size="xs" c="dimmed">Avg Response</Text>
          <Text fw={700} size="xl">4.2m</Text>
        </Card>
      </Stack>

      {/* Alert Triage Feed */}
      <Paper 
        shadow="sm" 
        p="md" 
        withBorder 
        style={{ flex: 1 }}
        data-testid="feed-AlertTriage"
        data-committed-selected={JSON.stringify(committedSelection)}
      >
        <Text fw={600} size="lg" mb="md">Alert Triage</Text>
        <ScrollArea
          h={300}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
        >
          <Stack gap="xs">
            {items.map((item) => (
              <Paper
                key={item.id}
                data-item-id={item.id}
                p="xs"
                withBorder
              >
                <Group gap="xs">
                  <Checkbox
                    size="sm"
                    checked={pendingSelection.has(item.id)}
                    onChange={() => handleToggle(item.id)}
                  />
                  <Text fw={600} size="sm">{item.id}</Text>
                  <Text size="sm">{item.title}</Text>
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
        <Group justify="space-between" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Text size="xs" c="dimmed">
            Selected (pending): {pendingSelection.size}
            {committedSelection.length > 0 && ` | ${committedSelection.length} committed`}
          </Text>
          <Button
            size="xs"
            disabled={pendingSelection.size === 0}
            onClick={handleApply}
          >
            Apply
          </Button>
        </Group>
      </Paper>

      {/* More clutter */}
      <Stack gap="md" style={{ width: 150 }}>
        <Paper shadow="sm" p="sm" withBorder h={80}>
          <Text size="xs" c="dimmed">Chart placeholder</Text>
        </Paper>
        <Paper shadow="sm" p="sm" withBorder h={80}>
          <Text size="xs" c="dimmed">Graph placeholder</Text>
        </Paper>
      </Stack>
    </Group>
  );
}
