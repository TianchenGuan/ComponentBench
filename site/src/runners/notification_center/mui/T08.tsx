'use client';

/**
 * notification_center-mui-T08: Clear all notifications in dark mode
 *
 * setup_description:
 * Dark theme is enabled (dark drawer surface). The Notification Center is accessed via a bell icon and opens as a right-anchored Drawer.
 * 
 * Inside the drawer header, there is a button labeled "Clear all".
 * Clicking it opens an MUI Dialog with:
 *   - Title: "Clear notifications?"
 *   - Buttons: "Cancel" and "Clear"
 * 
 * Initial state:
 *   - Drawer is closed.
 *   - The inbox contains 18 notifications.
 * 
 * The task requires completing the clear-all flow and confirming in the dialog (not canceling).
 * Feedback: after confirmation, the list becomes empty, unread badge becomes 0, and an informational Snackbar "Notifications cleared" briefly appears.
 *
 * success_trigger: Notification Center list count is 0 after clearing.
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
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import type { TaskComponentProps } from '../types';

const generateNotifications = () =>
  Array.from({ length: 18 }, (_, i) => ({
    id: `notif_${i + 1}`,
    title: `Notification ${i + 1}`,
    read: i % 3 === 0,
  }));

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(generateNotifications);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (notifications.length === 0 && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const handleClearAll = () => {
    setDialogOpen(true);
  };

  const handleConfirmClear = () => {
    setNotifications([]);
    setDialogOpen(false);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader
          title="Dashboard"
          action={
            <IconButton
              aria-label="Notification Center"
              onClick={() => setDrawerOpen(true)}
              data-testid="notif-bell-primary"
            >
              <Badge badgeContent={unreadCount} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          }
        />
        <CardContent>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Dashboard content
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Notification Center</Typography>
            <Button
              color="error"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </Box>

          {notifications.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No notifications
            </Typography>
          ) : (
            <List disablePadding>
              {notifications.map((notif) => (
                <ListItem key={notif.id} divider>
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
                    <Typography fontWeight={notif.read ? 400 : 600}>
                      {notif.title}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Clear notifications?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove all notifications. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmClear} color="error" variant="contained">
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Notifications cleared
        </Alert>
      </Snackbar>
    </>
  );
}
