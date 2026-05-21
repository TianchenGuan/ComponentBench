'use client';

/**
 * drawer-mui-T07: Close a small bottom-anchored drawer via header close icon (compact/small)
 *
 * Layout: isolated_card centered, with COMPACT spacing and SMALL component scale.
 *
 * Initial state:
 * - A MUI Drawer titled "Quick add" is OPEN on page load.
 * - Drawer is anchored at the bottom (bottom sheet style) and covers roughly the lower half of the card area.
 * - Backdrop is visible, but backdrop-click dismissal is disabled (onClose ignores reason='backdropClick').
 *
 * Target close control:
 * - A small IconButton with an X icon is located in the top-right of the drawer header.
 *
 * Drawer contents:
 * - A short list of suggested items (read-only chips) to create visual clutter inside the drawer but not required for success.
 *
 * Feedback:
 * - Clicking the close icon dismisses the drawer with a slide-down animation and removes the backdrop.
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
  Chip,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleClose = (event: object, reason: string) => {
    // Ignore backdrop click
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const suggestions = ['Note', 'Task', 'Reminder', 'Event', 'Contact'];

  return (
    <Card sx={{ width: 300 }} variant="outlined">
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="body2">
          Close the drawer using the X button in the header.
        </Typography>

        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          data-testid="drawer-quick-add"
        >
          <Box sx={{ p: 2, minHeight: 200 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={500}>
                Quick add
              </Typography>
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                data-testid="drawer-quick-add-close"
              >
                <Close fontSize="small" />
              </IconButton>
            </Stack>
            
            <Typography variant="body2" color="text.secondary" mb={2}>
              Select what to create:
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {suggestions.map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
}
