'use client';

/**
 * menu_button-mui-T01: Open More options menu (icon button)
 * 
 * Layout: isolated_card centered titled "Item".
 * There is a single icon-only menu button (three-dot IconButton) with accessible name "More options".
 * Clicking it opens a MUI Menu anchored to the button with three MenuItems:
 * "Edit", "Duplicate", "Archive".
 * 
 * Initial state: menu closed. No selection state; success is purely the open/closed overlay state.
 * Success: The MUI Menu is open (visible and not aria-hidden).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [open, successTriggered, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Typography variant="h6">Item</Typography>
          <IconButton
            aria-label="More options"
            aria-controls={open ? 'more-options-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            data-testid="menu-button-more-options"
          >
            <MoreVertIcon />
          </IconButton>
        </div>
        <Typography variant="body2" color="text.secondary">
          Item details would appear here.
        </Typography>
        <Menu
          id="more-options-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Edit</MenuItem>
          <MenuItem onClick={handleClose}>Duplicate</MenuItem>
          <MenuItem onClick={handleClose}>Archive</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
