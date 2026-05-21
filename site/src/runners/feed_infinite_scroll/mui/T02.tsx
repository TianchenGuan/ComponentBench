'use client';

/**
 * feed_infinite_scroll-mui-T02: Messages: expand MSG-004
 * 
 * Layout: isolated card centered on the page titled "Messages".
 * The feed is a fixed-height scrollable MUI List; clicking a ListItemButton expands
 * an inline preview area using a Collapse component.
 * Only one message can be expanded at a time.
 * Initial state: the feed is at the top with MSG-001 … MSG-020 loaded.
 * 
 * Success: active_item_id equals MSG-004 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Collapse,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

const MESSAGE_TITLES: Record<number, string> = {
  1: 'Welcome to the platform',
  2: 'Account verification',
  3: 'New feature announcement',
  4: 'Updated shipping address',
  5: 'Order confirmation',
  6: 'Payment receipt',
  7: 'Weekly newsletter',
  8: 'Team invitation',
  9: 'Project update',
  10: 'Meeting notes',
  11: 'Feedback request',
  12: 'Survey invitation',
  13: 'Product launch',
  14: 'Holiday hours',
  15: 'Policy update',
  16: 'Service notification',
  17: 'Maintenance complete',
  18: 'New connection',
  19: 'Birthday reminder',
  20: 'Event invitation',
};

function generateItems(start: number, count: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `MSG-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: MESSAGE_TITLES[i] || `Message ${i}`,
      timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
      preview: `This is the preview content for ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    });
  }
  return items;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'MSG-004') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeItemId, onSuccess]);

  const handleItemClick = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 100) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Paper 
      elevation={2} 
      sx={{ width: 500, overflow: 'hidden' }}
      data-active-item-id={activeItemId}
    >
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        Messages
      </Typography>
      <Box
        ref={containerRef}
        data-testid="feed-Messages"
        sx={{
          height: 400,
          overflow: 'auto',
        }}
        onScroll={handleScroll}
      >
        <List disablePadding>
          {items.map((item) => (
            <Box key={item.id}>
              <ListItemButton
                data-item-id={item.id}
                aria-expanded={activeItemId === item.id}
                onClick={() => handleItemClick(item.id)}
                selected={activeItemId === item.id}
                sx={{ py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Box>
                      <Typography component="span" fontWeight="bold" fontSize={14}>
                        {item.id}
                      </Typography>
                      <Typography component="span" fontSize={14}>
                        {' '}· {item.title}
                      </Typography>
                    </Box>
                  }
                  secondary={item.timestamp}
                />
              </ListItemButton>
              <Collapse in={activeItemId === item.id}>
                <Box 
                  data-expanded-for={item.id}
                  sx={{ 
                    px: 2, 
                    py: 1.5, 
                    bgcolor: 'grey.50',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <Typography variant="caption" fontWeight="bold" display="block" mb={0.5}>
                    Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.preview}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          ))}
        </List>
        {loading && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
