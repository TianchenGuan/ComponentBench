'use client';

/**
 * feed_infinite_scroll-mui-T03: Notifications: enable Starred only
 * 
 * Layout: isolated card titled "Notifications" centered on the page.
 * The feed header contains a labeled Switch: "Starred only" (OFF by default).
 * Some notification rows show a small star icon indicating they are starred.
 * Turning the filter ON immediately refreshes the list to show only starred notifications.
 * 
 * Success: filters.starred_only equals true
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  isStarred: boolean;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'New message received',
    'Account verified',
    'Security alert',
    'Friend request',
    'Payment confirmed',
    'Subscription renewed',
    'Profile updated',
    'New follower',
    'Comment on post',
    'Meeting reminder',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `NOTIF-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
      isStarred: Math.random() < 0.3, // 30% starred
    });
  }
  return items;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 25));
  const [starredOnly, setStarredOnly] = useState(false);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && starredOnly) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [starredOnly, onSuccess]);

  const filteredItems = starredOnly ? items.filter(item => item.isStarred) : items;

  return (
    <Paper 
      elevation={2} 
      sx={{ width: 500, overflow: 'hidden' }}
      data-filters={JSON.stringify({ starred_only: starredOnly })}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Notifications</Typography>
          {starredOnly && <Chip label="Filtered" size="small" color="primary" />}
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={starredOnly}
              onChange={(e) => setStarredOnly(e.target.checked)}
              inputProps={{ 'aria-label': 'Starred only' }}
            />
          }
          label="Starred only"
          labelPlacement="start"
        />
      </Box>
      <Box
        data-testid="feed-Notifications"
        sx={{
          height: 400,
          overflow: 'auto',
        }}
      >
        <List disablePadding>
          {filteredItems.map((item) => (
            <ListItem
              key={item.id}
              data-item-id={item.id}
              divider
              sx={{ py: 1.5 }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.isStarred && (
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    )}
                    <Typography component="span" fontWeight="bold" fontSize={14}>
                      {item.id}
                    </Typography>
                    <Typography component="span" fontSize={14}>
                      · {item.title}
                    </Typography>
                  </Box>
                }
                secondary={item.timestamp}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
