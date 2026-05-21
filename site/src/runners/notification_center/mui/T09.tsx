'use client';

/**
 * notification_center-mui-T09: Match Team unread count to reference
 *
 * setup_description:
 * Two Notification Center widgets are shown side-by-side in an isolated layout:
 *   - Left: "Personal" Notification Center (instance label: Personal)
 *   - Right: "Team" Notification Center (instance label: Team)  <-- target
 * 
 * Each instance has its own bell IconButton + Badge and its own inline list of notifications.
 * A small non-interactive "Target" preview sits above the Team instance, showing a badge with the number 1.
 * 
 * Initial state:
 *   - Personal unread badge: 2
 *   - Team unread badge: 3
 * 
 * Each notification row in the Team list has a trailing icon button to toggle read/unread.
 * The goal is ONLY to make the Team unread badge equal the target preview value (1). The Personal instance should be left unchanged.
 * Feedback: toggling Team items updates only the Team badge count immediately.
 *
 * success_trigger: In the Team Notification Center instance, the unread badge count equals 1.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  read: boolean;
}

const initialPersonalNotifications: Notification[] = [
  { id: 'p1', title: 'Personal alert 1', read: false },
  { id: 'p2', title: 'Personal alert 2', read: false },
  { id: 'p3', title: 'Personal info', read: true },
];

const initialTeamNotifications: Notification[] = [
  { id: 't1', title: 'Team alert 1', read: false },
  { id: 't2', title: 'Team alert 2', read: false },
  { id: 't3', title: 'Team alert 3', read: false },
  { id: 't4', title: 'Team info', read: true },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [personalNotifications, setPersonalNotifications] = useState(initialPersonalNotifications);
  const [teamNotifications, setTeamNotifications] = useState(initialTeamNotifications);
  const successCalledRef = useRef(false);

  const personalUnreadCount = personalNotifications.filter(n => !n.read).length;
  const teamUnreadCount = teamNotifications.filter(n => !n.read).length;

  useEffect(() => {
    if (teamUnreadCount === 1 && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [teamUnreadCount, onSuccess]);

  const togglePersonalRead = (id: string) => {
    setPersonalNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const toggleTeamRead = (id: string) => {
    setTeamNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const NotificationList = ({
    notifications,
    onToggle,
    testIdPrefix,
  }: {
    notifications: Notification[];
    onToggle: (id: string) => void;
    testIdPrefix: string;
  }) => (
    <List dense disablePadding>
      {notifications.map((notif) => (
        <ListItem
          key={notif.id}
          divider
          secondaryAction={
            <Tooltip title={notif.read ? 'Mark as unread' : 'Mark as read'}>
              <IconButton
                edge="end"
                size="small"
                onClick={() => onToggle(notif.id)}
                data-testid={`${testIdPrefix}-toggle-${notif.id}`}
              >
                {notif.read ? <UndoIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
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
                }}
              />
            )}
            <ListItemText
              primary={notif.title}
              primaryTypographyProps={{ fontWeight: notif.read ? 400 : 600 }}
            />
          </Box>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box>
      {/* Target preview */}
      <Card sx={{ width: 200, mb: 2, ml: 'auto', mr: 0 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Target for Team
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={1} color="primary">
              <NotificationsIcon />
            </Badge>
            <Typography variant="body2">Unread: 1</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Two notification centers side by side */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Card sx={{ width: 320 }} data-testid="notif-center-personal">
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Personal
                <Badge badgeContent={personalUnreadCount} color="primary" />
              </Box>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <NotificationList
              notifications={personalNotifications}
              onToggle={togglePersonalRead}
              testIdPrefix="personal"
            />
          </CardContent>
        </Card>

        <Card sx={{ width: 320 }} data-testid="notif-center-team">
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Team
                <Badge badgeContent={teamUnreadCount} color="primary" />
              </Box>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <NotificationList
              notifications={teamNotifications}
              onToggle={toggleTeamRead}
              testIdPrefix="team"
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
