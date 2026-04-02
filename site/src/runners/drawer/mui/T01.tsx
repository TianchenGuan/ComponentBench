'use client';

/**
 * drawer-mui-T01: Open Navigation drawer (temporary, left)
 *
 * Layout: isolated_card centered with comfortable spacing. The card simulates a small app header.
 *
 * On the card:
 * - A single MUI Button labeled "Open navigation".
 *
 * Target component: MUI Drawer (variant="temporary", anchor="left").
 * - Initial state: CLOSED.
 * - Opening it slides a panel in from the left and shows the header text "Navigation".
 * - A backdrop (mask) appears over the rest of the page.
 *
 * Drawer contents (not required for success):
 * - A short list of navigation items (List/ListItem) rendered as read-only text for this task.
 *
 * Feedback:
 * - The drawer slide-in animation and backdrop make the open state obvious.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          App Header
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          data-testid="open-nav-drawer"
        >
          Open navigation
        </Button>

        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          data-testid="drawer-navigation"
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Navigation
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Help" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
}
