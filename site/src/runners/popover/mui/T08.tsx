'use client';

/**
 * popover-mui-T08: Open context popover inside preview box (right-click)
 *
 * Isolated card anchored near the top-right of the viewport.
 * Inside the card is a large gray rectangle labeled 'Preview' (a div that listens for contextmenu events).
 * On right-click, the page opens a MUI Popover using anchorReference='anchorPosition' so it appears near the cursor.
 * Popover title: 'Canvas actions'; body contains three non-interactive action labels.
 * Initial state: popover closed.
 * The browser's default context menu is prevented inside the Preview box.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Popover, Box, List, ListItem, ListItemText } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const successCalledRef = useRef(false);

  const open = Boolean(anchorPosition);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };

  const handleClose = () => {
    setAnchorPosition(null);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Canvas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Right-click inside the box to open canvas actions.
        </Typography>
        <Box
          onContextMenu={handleContextMenu}
          data-testid="preview-box"
          sx={{
            width: '100%',
            height: 200,
            backgroundColor: '#e0e0e0',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'context-menu',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Preview
          </Typography>
        </Box>
        <Popover
          open={open}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition ?? undefined}
          data-testid="popover-canvas-actions"
        >
          <Box sx={{ p: 1.5, minWidth: 150 }}>
            <Typography variant="subtitle2" sx={{ px: 1, pb: 1 }}>
              Canvas actions
            </Typography>
            <List dense disablePadding>
              <ListItem>
                <ListItemText primary="Select all" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Copy" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Paste" />
              </ListItem>
            </List>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
