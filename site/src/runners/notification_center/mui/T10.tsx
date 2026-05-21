'use client';

/**
 * notification_center-mui-T10: Archive the security alert identified by icon
 *
 * setup_description:
 * The page is a dashboard with multiple cards (KPIs, charts, recent activity) creating medium clutter.
 * The Notification Center is presented as a dashboard card in the center column titled "Notifications" with a bell IconButton + Badge.
 * 
 * Clicking the bell opens an overlay titled "Notification Center" (Popover or temporary Drawer).
 * Inside is a long scrollable list (~40) of Alert-styled notifications.
 * 
 * The target notification:
 *   - id: 'security_policy_violation'
 *   - visible title text includes exactly: "Security policy violation"
 *   - located near the bottom of the list (requires scrolling)
 * 
 * Each row has an overflow menu (⋮) or an Archive icon button; archiving moves the item into the Archived view.
 * Distractors: multiple security-related rows exist, including "Security scan completed" and "Security policy review scheduled".
 * Feedback: after archiving, the target row disappears from the active list and appears under the Archived view; no confirm dialog.
 *
 * success_trigger: Notification 'security_policy_violation' is archived.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  Typography,
  Box,
  Tooltip,
  Alert,
  Grid,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArchiveIcon from '@mui/icons-material/Archive';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  archived: boolean;
}

const generateNotifications = (): Notification[] => {
  const items: Notification[] = [];

  items.push({ id: 'security_scan_completed', title: 'Security scan completed', severity: 'success', archived: false });
  items.push({ id: 'security_policy_review', title: 'Security policy review scheduled', severity: 'info', archived: false });

  for (let i = 1; i <= 15; i++) {
    items.push({ id: `alert_${i}`, title: `System alert ${i}`, severity: 'info', archived: false });
  }

  items.push({ id: 'security_update', title: 'Security update available', severity: 'warning', archived: false });

  for (let i = 16; i <= 30; i++) {
    items.push({ id: `alert_${i}`, title: `System alert ${i}`, severity: 'info', archived: false });
  }

  // Target near the bottom
  items.push({ id: 'security_policy_violation', title: 'Security policy violation', severity: 'error', archived: false });

  for (let i = 31; i <= 38; i++) {
    items.push({ id: `alert_${i}`, title: `System alert ${i}`, severity: 'info', archived: false });
  }

  return items;
};

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(generateNotifications);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const successCalledRef = useRef(false);

  const activeNotifications = notifications.filter(n => !n.archived);
  const archivedCount = notifications.filter(n => n.archived).length;

  useEffect(() => {
    const target = notifications.find(n => n.id === 'security_policy_violation');
    if (target?.archived && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const handleArchive = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, archived: true } : n)
    );
  };

  const open = Boolean(anchorEl);

  return (
    <Grid container spacing={2} sx={{ maxWidth: 900 }}>
      {/* KPI Cards - distractors */}
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Total Users</Typography>
            <Typography variant="h4">1,234</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Revenue</Typography>
            <Typography variant="h4">$45.6K</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Active Sessions</Typography>
            <Typography variant="h4">89</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Notification Center Card */}
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title="Notifications"
            action={
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="Open Notification Center"
                data-testid="notif-bell-primary"
              >
                <Badge badgeContent={activeNotifications.length} color="primary" max={99}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            }
          />
          <CardContent>
            <Typography color="text.secondary">
              Click the bell to view notifications
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity - distractor */}
      <Grid item xs={6}>
        <Card>
          <CardHeader title="Recent Activity" />
          <CardContent>
            <Typography variant="body2">User login: admin</Typography>
            <Typography variant="body2">File uploaded: report.pdf</Typography>
            <Typography variant="body2">Settings changed</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart placeholder - distractor */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Analytics Overview" />
          <CardContent sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">[Chart placeholder]</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        data-testid="notif-popover"
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Notification Center</Typography>
            <Typography variant="body2" color="text.secondary">
              Archived: {archivedCount}
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <List disablePadding>
              {activeNotifications.map((notif) => (
                <ListItem
                  key={notif.id}
                  data-notif-id={notif.id}
                  sx={{ px: 0, py: 0.5 }}
                  secondaryAction={
                    <Tooltip title="Archive">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleArchive(notif.id)}
                        aria-label="Archive notification"
                        data-testid={`archive-${notif.id}`}
                      >
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Alert severity={notif.severity} sx={{ flex: 1, py: 0 }}>
                    {notif.title}
                  </Alert>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Popover>
    </Grid>
  );
}
