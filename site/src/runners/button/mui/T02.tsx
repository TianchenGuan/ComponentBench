'use client';

/**
 * button-mui-T02: Open shortcuts menu (large icon button)
 * 
 * Baseline isolated help card titled "Help".
 * Single large IconButton with keyboard icon that opens a Menu.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onSuccess();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 300 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Help
        </Typography>
        <Tooltip title="Keyboard shortcuts">
          <IconButton
            size="large"
            onClick={handleClick}
            aria-label="Keyboard shortcuts"
            aria-expanded={menuOpen}
            data-testid="mui-iconbtn-shortcuts"
          >
            <KeyboardIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleClose}
          data-overlay-id="mui-menu-shortcuts"
        >
          <MenuItem onClick={handleClose}>Basics</MenuItem>
          <MenuItem onClick={handleClose}>Navigation</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
