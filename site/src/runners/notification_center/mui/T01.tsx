'use client';

/**
 * notification_center-mui-T01: Open notification center drawer
 *
 * setup_description:
 * Baseline isolated card centered in the viewport. In the header is a Material UI IconButton with a bell icon.
 * The bell is wrapped in an MUI Badge showing an unread count of 5.
 * 
 * Clicking the bell opens a right-anchored MUI Drawer titled "Notification Center".
 * The drawer contains a persistent inbox list that mirrors recent Snackbar/Alert messages (each row is styled like an Alert with an icon and severity color),
 * but for this task the only required action is to open the drawer.
 * 
 * Distractors: a second IconButton with a chat bubble icon (no badge) sits next to the bell and opens a dummy "Chat" drawer.
 * Feedback: drawer open state is immediately visible and does not require confirmation.
 *
 * success_trigger: The Notification Center drawer for the only instance is open.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'Build succeeded', severity: 'success' as const },
  { id: '2', title: 'Warning: High memory usage', severity: 'warning' as const },
  { id: '3', title: 'New user registered', severity: 'info' as const },
  { id: '4', title: 'Deployment failed', severity: 'error' as const },
  { id: '5', title: 'File uploaded', severity: 'success' as const },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (drawerOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [drawerOpen, onSuccess]);

  return (
    <>
      <Card sx={{ width: 500 }}>
        <CardHeader
          title="Dashboard"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                aria-label="Chat"
                onClick={() => setChatDrawerOpen(true)}
                data-testid="chat-btn"
              >
                <ChatBubbleOutlineIcon />
              </IconButton>
              <IconButton
                aria-label="Notification Center"
                onClick={() => setDrawerOpen(true)}
                data-testid="notif-bell-primary"
              >
                <Badge badgeContent={5} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Your dashboard content goes here
          </Typography>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data-testid="notif-drawer-primary"
      >
        <Box sx={{ width: 360, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notification Center
          </Typography>
          <List>
            {notifications.map((notif) => (
              <ListItem key={notif.id} sx={{ px: 0 }}>
                <Alert severity={notif.severity} sx={{ width: '100%' }}>
                  {notif.title}
                </Alert>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">Chat</Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No messages
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
