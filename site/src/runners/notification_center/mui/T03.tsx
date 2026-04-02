'use client';

/**
 * notification_center-mui-T03: Filter to Unread
 *
 * setup_description:
 * Baseline isolated card centered in the viewport with the Notification Center rendered inline (no drawer).
 * At the top of the widget is a segmented control implemented with MUI ToggleButtonGroup (or selectable Chips) with three options:
 * "All", "Unread", "Archived". Initial selection is "All".
 * 
 * The list below contains a mix of read and unread notifications. Unread items show a filled dot indicator and contribute to the unread badge count.
 * Switching to "Unread" updates the selected styling of the segmented control and filters the list.
 * 
 * Distractors: a "Sort by" dropdown exists to the right of the segmented control, but it does not change the active view (All/Unread/Archived).
 * Feedback: the number of visible list items changes immediately, and the active selection highlight moves to "Unread".
 *
 * success_trigger: The Notification Center active view is set to 'Unread'.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'New deployment', time: '5m ago', unread: true },
  { id: '2', title: 'Test results ready', time: '15m ago', unread: false },
  { id: '3', title: 'PR approved', time: '30m ago', unread: true },
  { id: '4', title: 'Build completed', time: '1h ago', unread: false },
  { id: '5', title: 'Security scan', time: '2h ago', unread: true },
  { id: '6', title: 'Backup finished', time: '3h ago', unread: false },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [activeView, setActiveView] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (activeView === 'Unread' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeView, onSuccess]);

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: string | null) => {
    if (newView) {
      setActiveView(newView);
    }
  };

  const filteredNotifications = activeView === 'Unread'
    ? notifications.filter(n => n.unread)
    : activeView === 'Archived'
    ? []
    : notifications;

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Notification Center
            <Badge badgeContent={unreadCount} color="primary" />
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <ToggleButtonGroup
            value={activeView}
            exclusive
            onChange={handleViewChange}
            size="small"
            data-testid="view-toggle"
          >
            <ToggleButton value="All" aria-label="All">
              All
            </ToggleButton>
            <ToggleButton value="Unread" aria-label="Unread" data-testid="notif-tab-unread">
              Unread
            </ToggleButton>
            <ToggleButton value="Archived" aria-label="Archived">
              Archived
            </ToggleButton>
          </ToggleButtonGroup>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort by"
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <List>
          {filteredNotifications.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No notifications
            </Typography>
          ) : (
            filteredNotifications.map((notif) => (
              <ListItem key={notif.id} divider>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  {notif.unread && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <ListItemText
                    primary={notif.title}
                    secondary={notif.time}
                    primaryTypographyProps={{ fontWeight: notif.unread ? 600 : 400 }}
                  />
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
}
