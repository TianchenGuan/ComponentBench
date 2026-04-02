'use client';

/**
 * context_menu-mui-T02: Copy message text from context menu
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a single message bubble containing the exact text "See you at 3pm".
 * Right-clicking on that bubble opens a custom context menu.
 *
 * Implementation: an onContextMenu handler on the bubble opens a MUI Menu using anchorPosition.
 *
 * Menu items: Reply, Copy text, Forward.
 *
 * Distractors: another older message bubble is shown above, but it does NOT open a custom context menu.
 *
 * Success: The activated item path equals ['Copy text'] for the message context menu.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Copy text' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedItem, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
  };

  const handleMenuClick = (item: string) => {
    setLastActivatedItem(item);
    handleClose();
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      
      {/* Old message - no context menu */}
      <Box
        sx={{
          p: 1.5,
          bgcolor: 'grey.100',
          borderRadius: 2,
          maxWidth: '80%',
          mb: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Hey, what time works for you?
        </Typography>
        <Typography variant="caption" color="text.disabled">
          10:30 AM
        </Typography>
      </Box>

      {/* Target message - has context menu */}
      <Box
        onContextMenu={handleContextMenu}
        sx={{
          p: 1.5,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          maxWidth: '80%',
          ml: 'auto',
          cursor: 'context-menu',
        }}
        data-testid="message-bubble"
        data-last-activated={lastActivatedItem}
      >
        <Typography variant="body2">
          See you at 3pm
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          10:32 AM
        </Typography>
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem onClick={() => handleMenuClick('Reply')}>Reply</MenuItem>
        <MenuItem onClick={() => handleMenuClick('Copy text')}>Copy text</MenuItem>
        <MenuItem onClick={() => handleMenuClick('Forward')}>Forward</MenuItem>
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </Typography>
    </Paper>
  );
}
