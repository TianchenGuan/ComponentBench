'use client';

/**
 * notification_center-mui-T04: Search for a password reset alert and mark it read
 *
 * setup_description:
 * Compact spacing mode is enabled (smaller paddings and denser list). The Notification Center is an inline widget in an isolated card.
 * A search TextField labeled "Search notifications" sits above the list.
 * 
 * The list contains ~25 security-related notifications (styled like MUI Alerts). Several entries are similar:
 *   - "Password reset requested" (id 'password_reset')  <-- target
 *   - "Password changed" (id 'password_changed')
 *   - "Password reset link expired" (id 'password_reset_expired')
 * 
 * Each row has a trailing icon-only action (a check icon) with accessible name "Mark as read" when the row is unread.
 * Initial state: 'password_reset' is unread.
 * 
 * Distractors: there is also a global page search box in the top nav (outside the component) that must not be used.
 * Feedback: when the target is marked read, its unread indicator disappears and the unread badge count decreases by 1.
 *
 * success_trigger: Notification 'password_reset' is marked read.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Badge,
  IconButton,
  Tooltip,
  InputAdornment,
  AppBar,
  Toolbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 'login_alert', title: 'New login detected', read: true },
  { id: 'password_reset', title: 'Password reset requested', read: false },
  { id: 'password_changed', title: 'Password changed', read: true },
  { id: 'password_reset_expired', title: 'Password reset link expired', read: false },
  { id: '2fa_enabled', title: '2FA enabled', read: true },
  { id: 'session_timeout', title: 'Session timeout warning', read: false },
  { id: 'api_key_created', title: 'New API key created', read: true },
  { id: 'account_locked', title: 'Account locked', read: false },
  { id: 'email_verified', title: 'Email verified', read: true },
  { id: 'backup_codes', title: 'Backup codes generated', read: true },
  { id: 'device_removed', title: 'Device removed', read: false },
  { id: 'permissions_changed', title: 'Permissions changed', read: true },
  { id: 'oauth_connected', title: 'OAuth app connected', read: false },
  { id: 'password_expiring', title: 'Password expiring soon', read: true },
  { id: 'suspicious_activity', title: 'Suspicious activity detected', read: false },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const passwordReset = notifications.find(n => n.id === 'password_reset');
    if (passwordReset?.read && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const toggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const filteredNotifications = notifications.filter(n =>
    searchQuery === '' || n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Global search in nav - distractor */}
      <AppBar position="static" color="default" sx={{ mb: 2 }}>
        <Toolbar variant="dense">
          <Typography sx={{ flexGrow: 1 }}>Security Portal</Typography>
          <TextField
            size="small"
            placeholder="Search site..."
            sx={{ width: 200 }}
          />
        </Toolbar>
      </AppBar>

      <Card sx={{ width: 500 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Notification Center
              <Badge badgeContent={unreadCount} color="primary" />
            </Box>
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search notifications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            data-testid="notif-search"
          />

          <List dense disablePadding>
            {filteredNotifications.map((notif) => (
              <ListItem
                key={notif.id}
                data-notif-id={notif.id}
                data-read={notif.read}
                divider
                sx={{ py: 0.5 }}
                secondaryAction={
                  !notif.read && (
                    <Tooltip title="Mark as read">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => toggleRead(notif.id)}
                        aria-label="Mark as read"
                        data-testid={`mark-read-${notif.id}`}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {!notif.read && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <ListItemText
                    primary={notif.title}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: notif.read ? 400 : 600,
                    }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
