'use client';

/**
 * drawer-mui-T04: Open Notifications drawer from a corner-anchored header icon
 *
 * Layout: isolated_card anchored to the bottom-right of the viewport (not centered). Spacing is comfortable; scale is default.
 *
 * Within the card is a compact app-bar row:
 * - Left: text label "Dashboard"
 * - Right: a small MUI IconButton with a bell icon and aria-label "Open notifications"
 *
 * Target component: MUI Drawer (variant="temporary", anchor="right").
 * - Initial state: CLOSED.
 * - When opened, it slides in from the right with a header title "Notifications".
 * - Backdrop is enabled.
 *
 * Distractors:
 * - Next to the bell icon is a disabled IconButton (settings gear) that does nothing.
 *
 * Feedback:
 * - Drawer opening animation and backdrop indicate success.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Drawer,
  Box,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Notifications, Settings } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card sx={{ width: 320 }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={500}>
            Dashboard
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => setOpen(true)}
              aria-label="Open notifications"
              data-testid="open-notifications"
            >
              <Notifications fontSize="small" />
            </IconButton>
            <IconButton size="small" disabled>
              <Settings fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          data-testid="drawer-notifications"
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Notifications
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="New message received"
                  secondary="2 minutes ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Task completed"
                  secondary="1 hour ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="System update available"
                  secondary="Yesterday"
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
}
