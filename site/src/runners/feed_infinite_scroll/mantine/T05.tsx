'use client';

/**
 * feed_infinite_scroll-mantine-T05: Top-left feed: search and open CUST-221
 * 
 * Layout: isolated_card anchored at the top-left of the viewport.
 * The card is titled "Customer Notes" and contains a Mantine ScrollArea feed.
 * The feed header includes a TextInput labeled "Search notes" with a search icon.
 * Submitting the search filters results; clicking a note row expands inline details.
 * 
 * Success: active_item_id equals CUST-221 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Text, Group, Stack, TextInput, Loader, Box, Collapse } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  body: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Payment follow-up',
    'Support ticket',
    'Invoice inquiry',
    'Account review',
    'Contract discussion',
    'Product feedback',
    'Renewal notice',
    'Meeting notes',
    'Call summary',
    'Action items',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `CUST-${String(200 + i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 30) + 1}d ago`,
      body: `Full note for ${id}: Customer requested follow-up regarding their account. Please ensure all items are addressed before the next meeting.`,
    });
  }
  return items;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 50));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Filter items based on search
  const filteredItems = searchQuery
    ? items.filter(item => 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'CUST-221') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeItemId, onSuccess]);

  const handleSearch = () => {
    setLoading(true);
    setSearchQuery(searchInput);
    setActiveItemId(null);
    setTimeout(() => setLoading(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleItemClick = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };

  return (
    <Paper 
      shadow="sm" 
      p="md" 
      withBorder 
      style={{ width: 450 }}
      data-active-item-id={activeItemId}
    >
      <Text fw={600} size="lg" mb="md">Customer Notes</Text>
      <TextInput
        placeholder="Search notes"
        leftSection={<IconSearch size={14} />}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
        mb="md"
        data-testid="notes-search"
      />
      <ScrollArea
        h={350}
        viewportRef={viewportRef}
        data-testid="feed-CustomerNotes"
      >
        {loading ? (
          <Box ta="center" py="xl">
            <Loader size="sm" />
          </Box>
        ) : (
          <Stack gap="xs">
            {filteredItems.map((item) => (
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
                    <Text size="xs" fw={600} mb={4}>Note</Text>
                    <Text size="sm" c="dimmed">{item.body}</Text>
                  </Paper>
                </Collapse>
              </Box>
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Paper>
  );
}
