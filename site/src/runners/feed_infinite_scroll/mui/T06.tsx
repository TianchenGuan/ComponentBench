'use client';

/**
 * feed_infinite_scroll-mui-T06: Messages: use Scroll-to-top button
 * 
 * Layout: isolated card titled "Messages" centered on the page.
 * Initial state: the feed is pre-scrolled down (around MSG-060).
 * A small FloatingActionButton labeled "Top" appears overlayed inside the feed container.
 * Clicking the "Top" FAB scrolls the feed container back to scrollTop=0.
 * 
 * Success: scroll_top_px is 0 (within tolerance of 5px) and MSG-001 is visible
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Fab,
} from '@mui/material';
import { KeyboardArrowUp as ArrowUpIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Welcome message',
    'Account update',
    'New feature',
    'Weekly digest',
    'Team announcement',
    'Meeting invite',
    'Project status',
    'Reminder',
    'Feedback request',
    'Newsletter',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `MSG-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
    });
  }
  return items;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 80));
  const [scrollTop, setScrollTop] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);
  const initialScrollDoneRef = useRef(false);

  // Pre-scroll to middle on mount
  useEffect(() => {
    if (containerRef.current && !initialScrollDoneRef.current) {
      containerRef.current.scrollTop = 2400; // Scroll to around MSG-060
      setScrollTop(2400);
      initialScrollDoneRef.current = true;
    }
  }, []);

  // Check for success condition
  const checkSuccess = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;
    
    if (currentScrollTop <= 5) {
      const firstItem = container.querySelector('[data-item-id="MSG-001"]');
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

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    setScrollTop(currentScrollTop);
    setShowScrollTop(currentScrollTop > 50);
    checkSuccess();
  }, [checkSuccess]);

  const handleScrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Paper elevation={2} sx={{ width: 500, overflow: 'hidden', position: 'relative' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        Messages
      </Typography>
      <Box
        ref={containerRef}
        data-testid="feed-Messages"
        data-scroll-top={scrollTop}
        data-first-visible-item-id={scrollTop <= 5 ? 'MSG-001' : undefined}
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
      </Box>
      
      {showScrollTop && (
        <Fab
          size="small"
          color="primary"
          onClick={handleScrollToTop}
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
          }}
        >
          <ArrowUpIcon />
        </Fab>
      )}
    </Paper>
  );
}
