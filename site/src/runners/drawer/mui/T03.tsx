'use client';

/**
 * drawer-mui-T03: Close Navigation drawer with Escape
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * Initial state:
 * - The MUI Drawer titled "Navigation" is OPEN on page load (temporary drawer with a backdrop).
 * - The drawer is anchored on the left and covers part of the page.
 * - The backdrop is visible behind the drawer.
 *
 * Close behavior:
 * - The drawer listens for the Escape key and should close when Escape is pressed.
 * - The header includes a close icon, but keyboard dismissal is expected.
 *
 * Drawer content:
 * - A short list of navigation items (not required).
 *
 * Feedback:
 * - On successful dismissal, the drawer slides out and the backdrop disappears.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="body1">
          Close the Navigation drawer by pressing the Escape key.
        </Typography>

        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          data-testid="drawer-navigation"
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Navigation</Typography>
              <IconButton size="small" onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Box>
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
            </List>
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
}
