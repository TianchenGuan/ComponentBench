'use client';

/**
 * context_menu-mui-T03: Turn on Pin to top
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a single list row labeled "Bookmark: Research links".
 * Right-clicking the row opens a custom context menu.
 *
 * Implementation: onContextMenu opens a MUI Menu at cursor position.
 * One item behaves like a checkbox (shows a check icon when enabled).
 *
 * Menu items: Open, Pin to top (checkable), Remove.
 *
 * Initial state: Pin to top is OFF (unchecked).
 *
 * Success: The checked state for 'Pin to top' is true (ON).
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import { Check as CheckIcon, BookmarkBorder as BookmarkIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [pinToTop, setPinToTop] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (pinToTop && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [pinToTop, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
  };

  const handlePinToggle = () => {
    setPinToTop((prev) => !prev);
    // Keep menu open to show toggle state
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        Bookmarks
      </Typography>
      
      <Box
        onContextMenu={handleContextMenu}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200',
          cursor: 'context-menu',
        }}
        data-testid="bookmark-row"
        data-pin-to-top={pinToTop}
      >
        <BookmarkIcon color="primary" />
        <Box>
          <Typography variant="body1">Bookmark: Research links</Typography>
          <Typography variant="caption" color="text.secondary">
            5 items • Updated yesterday
          </Typography>
        </Box>
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem onClick={handleClose}>Open</MenuItem>
        <MenuItem onClick={handlePinToggle} data-testid="pin-to-top-item">
          {pinToTop && (
            <ListItemIcon>
              <CheckIcon fontSize="small" />
            </ListItemIcon>
          )}
          <Typography sx={{ pl: pinToTop ? 0 : 4 }}>Pin to top</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>Remove</MenuItem>
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Pin to top: <strong data-testid="pin-status">{pinToTop ? 'ON' : 'OFF'}</strong>
      </Typography>
    </Paper>
  );
}
