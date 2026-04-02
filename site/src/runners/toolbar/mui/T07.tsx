'use client';

/**
 * toolbar-mui-T07: Open the account menu from the toolbar
 *
 * A centered isolated card shows a MUI AppBar with a Toolbar labeled "Top bar". 
 * On the right side are two IconButtons ("Notifications" and "Account"). 
 * The Account control is an Avatar/IconButton with aria-label "Account".
 * Clicking the Account control opens a dropdown Menu with several items.
 * The task is only to end with the menu open; selecting an item is not required.
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Success when menu is opened
  useEffect(() => {
    if (menuOpen) {
      onSuccess();
    }
  }, [menuOpen, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 450, overflow: 'hidden' }}>
      <AppBar position="static" data-testid="mui-toolbar-topbar">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Top bar
          </Typography>
          <Tooltip title="Search">
            <IconButton color="inherit" data-testid="mui-toolbar-search">
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton color="inherit" data-testid="mui-toolbar-notifications">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Account">
            <IconButton
              onClick={handleAccountClick}
              aria-label="Account"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              data-testid="mui-toolbar-account"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                U
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Billing</MenuItem>
            <MenuItem onClick={handleMenuClose}>Sign out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Account menu: {menuOpen ? 'open' : 'closed'}
        </Typography>
      </Box>
    </Paper>
  );
}
