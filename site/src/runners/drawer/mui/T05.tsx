'use client';

/**
 * drawer-mui-T05: Pin a persistent Navigation drawer open (dark theme)
 *
 * Theme: DARK mode. Layout: isolated_card centered with comfortable spacing.
 *
 * This page demonstrates a persistent navigation drawer:
 * - There is a labeled control row with:
 *   - Text label "Pinned navigation"
 *   - A MUI Switch (off by default)
 *
 * Target component: MUI Drawer (variant="persistent", anchor="left").
 * - Initial state: CLOSED (not visible).
 * - When "Pinned navigation" is turned on, the drawer becomes visible and stays open without a backdrop.
 *
 * Drawer header:
 * - Shows the title "Navigation (pinned)".
 *
 * Distractors:
 * - A secondary button labeled "Open temporary drawer" is present but disabled in this task.
 *
 * Feedback:
 * - When pinned open, the drawer pushes content slightly to the right (persistent behavior) and remains visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  Drawer,
  Box,
  Stack,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControlLabel,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card sx={{ width: 380 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Navigation Settings
        </Typography>
        
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={open}
                onChange={(e) => setOpen(e.target.checked)}
                data-testid="pinned-switch"
              />
            }
            label="Pinned navigation"
          />
          
          <Button variant="outlined" disabled>
            Open temporary drawer
          </Button>
        </Stack>

        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          data-testid="drawer-navigation-persistent"
          sx={{
            '& .MuiDrawer-paper': {
              position: 'relative',
              width: 220,
            },
          }}
        >
          <Box sx={{ width: 220, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Navigation (pinned)
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Analytics" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Reports" />
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
