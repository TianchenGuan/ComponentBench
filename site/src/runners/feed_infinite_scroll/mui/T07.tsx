'use client';

/**
 * feed_infinite_scroll-mui-T07: Dashboard: find TASK-032 in Tasks feed
 * 
 * Layout: dashboard with two cards side-by-side.
 * Left card contains a "Notifications" infinite-scroll List.
 * Right card contains a "Tasks" infinite-scroll List.
 * Both lists share the same styling and are independently scrollable.
 * TASK-032 is deeper in the Tasks list and requires scrolling within that list.
 * 
 * Success: TASK-032 is visible within the Tasks feed viewport (min_visible_ratio: 0.5)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Task as TaskIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
}

function generateNotifications(start: number, count: number): FeedItem[] {
  const titles = [
    'New comment',
    'Mention',
    'Like received',
    'Follow request',
    'Share notification',
    'Reply received',
    'Tag notification',
    'Update available',
    'Message received',
    'Alert triggered',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `NOTIF-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 60) + 1}m ago`,
    });
  }
  return items;
}

function generateTasks(start: number, count: number): FeedItem[] {
  const titles = [
    'Update invoice template',
    'Review code changes',
    'Complete documentation',
    'Fix bug report',
    'Deploy to staging',
    'Write unit tests',
    'Update dependencies',
    'Create backup',
    'Optimize queries',
    'Review PR',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `TASK-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `Due ${Math.floor(Math.random() * 7) + 1}d`,
    });
  }
  return items;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState<FeedItem[]>(() => generateNotifications(1, 20));
  const [tasks, setTasks] = useState<FeedItem[]>(() => generateTasks(1, 20));
  const [notifLoading, setNotifLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const tasksContainerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check if target item is visible
  const checkVisibility = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = tasksContainerRef.current;
    if (!container) return;

    const targetElement = container.querySelector('[data-item-id="TASK-032"]');
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

  // Notifications scroll handler
  const handleNotifScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !notifLoading && notifications.length < 100) {
      setNotifLoading(true);
      setTimeout(() => {
        setNotifications(prev => [...prev, ...generateNotifications(prev.length + 1, 10)]);
        setNotifLoading(false);
      }, 500);
    }
  }, [notifLoading, notifications.length]);

  // Tasks scroll handler
  const handleTasksScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    checkVisibility();
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !taskLoading && tasks.length < 100) {
      setTaskLoading(true);
      setTimeout(() => {
        setTasks(prev => [...prev, ...generateTasks(prev.length + 1, 10)]);
        setTaskLoading(false);
      }, 500);
    }
  }, [taskLoading, tasks.length, checkVisibility]);

  useEffect(() => {
    checkVisibility();
  }, [checkVisibility, tasks]);

  return (
    <Box sx={{ width: 900 }}>
      {/* Dashboard toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <IconButton size="small"><SearchIcon /></IconButton>
        <IconButton size="small"><SettingsIcon /></IconButton>
      </Box>
      
      <Grid container spacing={2}>
        {/* Notifications Feed */}
        <Grid item xs={6}>
          <Paper elevation={1} sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              Notifications
            </Typography>
            <Box
              data-testid="feed-Notifications"
              sx={{
                height: 350,
                overflow: 'auto',
              }}
              onScroll={handleNotifScroll}
            >
              <List dense disablePadding>
                {notifications.map((item) => (
                  <ListItem
                    key={item.id}
                    data-item-id={item.id}
                    divider
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <NotificationsIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontSize={13}>
                          <strong>{item.id}</strong> · {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography fontSize={11} color="text.secondary">
                          {item.timestamp}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              {notifLoading && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Tasks Feed */}
        <Grid item xs={6}>
          <Paper elevation={1} sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              Tasks
            </Typography>
            <Box
              ref={tasksContainerRef}
              data-testid="feed-Tasks"
              sx={{
                height: 350,
                overflow: 'auto',
              }}
              onScroll={handleTasksScroll}
            >
              <List dense disablePadding>
                {tasks.map((item) => (
                  <ListItem
                    key={item.id}
                    data-item-id={item.id}
                    divider
                    sx={{ py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <TaskIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontSize={13}>
                          <strong>{item.id}</strong> · {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography fontSize={11} color="text.secondary">
                          {item.timestamp}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              {taskLoading && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
