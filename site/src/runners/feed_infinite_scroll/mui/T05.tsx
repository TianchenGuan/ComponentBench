'use client';

/**
 * feed_infinite_scroll-mui-T05: Inbox drawer: mark INB-057 as read
 * 
 * Layout: drawer_flow. The main page shows a small header and a button "Open inbox".
 * Clicking "Open inbox" opens a MUI Drawer from the right side.
 * Inside the Drawer is the "Inbox" feed with infinite loading.
 * Each row shows an ID, subject line, and a small "Mark read" icon button.
 * Unread items are indicated by bold text; marking as read removes the bold styling.
 * 
 * Success: item INB-057 has read=true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Drawer,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  subject: string;
  timestamp: string;
  isRead: boolean;
}

function generateItems(start: number, count: number): FeedItem[] {
  const subjects = [
    'Welcome aboard',
    'Meeting scheduled',
    'Invoice attached',
    'Project update',
    'Feedback received',
    'Action required',
    'Contract signed',
    'Deadline reminder',
    'Review completed',
    'New assignment',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `INB-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      subject: subjects[(i - 1) % subjects.length],
      timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
      isRead: Math.random() < 0.3, // 30% read initially
    });
  }
  return items;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    const item = items.find(i => i.id === 'INB-057');
    if (!successCalledRef.current && item?.isRead) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [items, onSuccess]);

  const handleMarkRead = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isRead: true } : item
    ));
  };

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 80) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 20)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <>
      <Paper elevation={1} sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Check your inbox for new messages.
        </Typography>
        <Button
          variant="contained"
          startIcon={<InboxIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{ mt: 2 }}
        >
          Open inbox
        </Button>
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 400 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6">Inbox</Typography>
          </Box>
          <Box
            ref={containerRef}
            data-testid="feed-Inbox"
            sx={{
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
            }}
            onScroll={handleScroll}
          >
            <List disablePadding>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  data-item-id={item.id}
                  data-read={item.isRead}
                  divider
                  secondaryAction={
                    !item.isRead && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleMarkRead(item.id)}
                        title="Mark read"
                      >
                        <MarkReadIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          component="span" 
                          fontWeight={item.isRead ? 'normal' : 'bold'} 
                          fontSize={14}
                        >
                          {item.id}
                        </Typography>
                        <Typography 
                          component="span" 
                          fontSize={14}
                          fontWeight={item.isRead ? 'normal' : 500}
                        >
                          · {item.subject}
                        </Typography>
                        {item.isRead && (
                          <Chip label="Read" size="small" sx={{ height: 18, fontSize: 10 }} />
                        )}
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
        </Box>
      </Drawer>
    </>
  );
}
