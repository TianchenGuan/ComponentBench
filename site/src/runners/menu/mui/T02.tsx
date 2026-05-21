'use client';

/**
 * menu-mui-T02: Open the Quick actions menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A MUI Menu component (popover) titled "Quick actions".
 * - A single trigger button labeled "Quick actions" sits above; when pressed, it opens the Menu anchored to the button.
 *
 * Initial state:
 * - The menu is closed (no menu items visible).
 *
 * Menu contents:
 * - Refresh
 * - Duplicate
 * - Archive
 *
 * Success: The Quick actions menu is open (menu overlay is visible / open state true).
 */

import React, { useState, useEffect } from 'react';
import { Paper, Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [successTriggered, setSuccessTriggered] = useState(false);

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
    <Paper elevation={2} sx={{ p: 3, width: 350 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Account</Typography>
      
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        aria-expanded={open}
        aria-haspopup="menu"
        data-testid="menu-button-quick-actions"
      >
        Quick actions
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        data-testid="menu-quick-actions"
      >
        <MenuItem onClick={handleClose}>Refresh</MenuItem>
        <MenuItem onClick={handleClose}>Duplicate</MenuItem>
        <MenuItem onClick={handleClose}>Archive</MenuItem>
      </Menu>

      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Menu is {open ? 'open' : 'closed'}
        </Typography>
      </Box>
    </Paper>
  );
}
