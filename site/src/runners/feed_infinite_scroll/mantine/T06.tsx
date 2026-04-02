'use client';

/**
 * feed_infinite_scroll-mantine-T06: Release notes modal: open RLS-042
 * 
 * Layout: modal_flow. The base page shows a button labeled "View release notes".
 * Clicking it opens a Mantine Modal.
 * Inside the modal is a fixed-height ScrollArea feed of release note entries (RLS-###)
 * with infinite loading. Clicking an entry expands its details inline within the modal.
 * RLS-042 is not in the initial viewport and may require scrolling and lazy-loading.
 * 
 * Success: active_item_id equals RLS-042 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Button, Modal, Group, Stack, Loader, Box, Collapse } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  version: string;
  timestamp: string;
  details: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'SSO improvements',
    'Bug fixes',
    'New API endpoints',
    'UI enhancements',
    'Performance boost',
    'Security updates',
    'Feature additions',
    'Documentation',
    'Mobile support',
    'Integrations',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `RLS-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      version: `v${Math.floor(i / 10)}.${i % 10}.0`,
      timestamp: `${Math.floor(Math.random() * 60) + 1}d ago`,
      details: `Release notes for ${id}: This release includes various improvements and fixes. Please review the changelog for complete details.`,
    });
  }
  return items;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'RLS-042') {
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
    
    if (scrollHeight - position.y - clientHeight < 100 && !loading && items.length < 60) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <>
      <Paper shadow="sm" p="xl" withBorder style={{ width: 300 }}>
        <Text fw={600} size="lg" mb="md">Product Updates</Text>
        <Text size="sm" c="dimmed" mb="lg">
          Check out our latest release notes and feature updates.
        </Text>
        <Button
          leftSection={<IconFileText size={16} />}
          onClick={() => setModalOpen(true)}
        >
          View release notes
        </Button>
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Release Notes"
        size="lg"
        data-testid="release-notes-modal"
      >
        <ScrollArea
          h={400}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
          data-testid="feed-ReleaseNotes"
          data-active-item-id={activeItemId}
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
                    <Text size="xs" c="dimmed">{item.version}</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4}>{item.timestamp}</Text>
                </Paper>
                <Collapse in={activeItemId === item.id}>
                  <Paper
                    data-expanded-for={item.id}
                    p="sm"
                    style={{ 
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderRadius: '0 0 4px 4px',
                    }}
                    withBorder
                  >
                    <Text size="xs" fw={600} mb={4}>Details</Text>
                    <Text size="sm" c="dimmed">{item.details}</Text>
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
      </Modal>
    </>
  );
}
