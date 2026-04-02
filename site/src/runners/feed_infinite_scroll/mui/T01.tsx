'use client';

/**
 * feed_infinite_scroll-mui-T01: Notifications: scroll to NOTIF-013
 * 
 * Layout: isolated card (Paper) centered on the page titled "Notifications".
 * The feed is a MUI List rendered inside a fixed-height scroll container.
 * Initial state: 25 notifications are loaded, but only ~7 fit in the viewport.
 * Each ListItem shows an ID prefix and a short label; items are visually uniform.
 * Infinite-loading is enabled but the target NOTIF-013 is within the initially loaded range.
 * 
 * Success: NOTIF-013 is visible within the feed viewport (min_visible_ratio: 0.5)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
}

const NOTIFICATION_TITLES: Record<number, string> = {
  1: 'New message received',
  2: 'Account verified',
  3: 'Security alert',
  4: 'Friend request',
  5: 'Payment confirmed',
  6: 'Subscription renewed',
  7: 'Profile updated',
  8: 'New follower',
  9: 'Comment on post',
  10: 'Meeting reminder',
  11: 'File shared',
  12: 'Password expiring',
  13: 'Password changed',
  14: 'Login from new device',
  15: 'Order shipped',
  16: 'Review request',
  17: 'Mention in channel',
  18: 'Event starting soon',
  19: 'Newsletter available',
  20: 'App update available',
  21: 'Weekly summary',
  22: 'Task completed',
  23: 'Report ready',
  24: 'Backup complete',
  25: 'Storage warning',
};

function generateItems(start: number, count: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `NOTIF-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: NOTIFICATION_TITLES[i] || `Notification ${i}`,
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
    });
  }
  return items;
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 25));
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check if target item is visible
  const checkVisibility = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    const targetElement = container.querySelector('[data-item-id="NOTIF-013"]');
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

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    checkVisibility();
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 100) {
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
    <Paper elevation={2} sx={{ width: 500, overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        Notifications
      </Typography>
      <Box
        ref={containerRef}
        data-testid="feed-Notifications"
        sx={{
          height: 400,
          overflow: 'auto',
        }}
        onScroll={handleScroll}
      >
        <List disablePadding>
          {items.map((item) => (
            <ListItem
              key={item.id}
              data-item-id={item.id}
              divider
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
            </ListItem>
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
