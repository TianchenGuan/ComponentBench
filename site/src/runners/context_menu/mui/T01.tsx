'use client';

/**
 * context_menu-mui-T01: Open context menu on Canvas
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=top_right, scale=default, instances=1.
 *
 * Target element: a large blank area labeled "Canvas" (a light gray rectangle) sits inside the card.
 * Right-clicking anywhere inside this canvas opens a custom context menu.
 *
 * Implementation: MUI Menu anchored by cursor coordinates (anchorReference='anchorPosition').
 * The Canvas has an onContextMenu handler that prevents the browser menu and opens a MUI Menu.
 *
 * Menu items: "Cut", "Copy", "Paste", and "Select all".
 *
 * Success: The custom MUI-based context menu overlay is open (menu_open=true).
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (menuOpen && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [menuOpen, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 450 }}>
      <Typography variant="h6" gutterBottom>
        Canvas
      </Typography>
      <Box
        onContextMenu={handleContextMenu}
        sx={{
          width: '100%',
          height: 250,
          bgcolor: 'grey.200',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'context-menu',
        }}
        data-testid="canvas-area"
        data-menu-open={menuOpen}
      >
        <Typography color="text.secondary">
          Right-click for context menu
        </Typography>
      </Box>
      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem onClick={handleClose}>Cut</MenuItem>
        <MenuItem onClick={handleClose}>Copy</MenuItem>
        <MenuItem onClick={handleClose}>Paste</MenuItem>
        <MenuItem onClick={handleClose}>Select all</MenuItem>
      </Menu>
    </Paper>
  );
}
