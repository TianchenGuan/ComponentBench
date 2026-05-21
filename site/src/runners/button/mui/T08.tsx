'use client';

/**
 * button-mui-T08: Open overflow menu in dark toolbar (small icon target)
 * 
 * Dark theme toolbar (top-right) with two IconButtons: Search and Overflow (three dots).
 * Task: Click the overflow icon to open its menu.
 */

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, Paper, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOverflowClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onSuccess();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper sx={{ p: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ mr: 2, fontWeight: 500 }}>Dashboard</Box>
      <Tooltip title="Search">
        <IconButton size="small" data-testid="mui-iconbtn-search">
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="More options">
        <IconButton
          size="small"
          onClick={handleOverflowClick}
          aria-expanded={menuOpen}
          data-testid="mui-iconbtn-overflow"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        data-overlay-id="mui-menu-overflow"
      >
        <MenuItem onClick={handleClose}>Export</MenuItem>
        <MenuItem onClick={handleClose}>Print</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
      </Menu>
    </Paper>
  );
}
