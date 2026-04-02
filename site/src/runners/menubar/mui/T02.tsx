'use client';

/**
 * menubar-mui-T02: Account → Profile
 * 
 * Layout: isolated_card, centered.
 * The header is built with MUI AppBar/Toolbar. The menubar has buttons: Dashboard, Reports, Account (dropdown).
 * Guidance (mixed): above the menubar is a small "Target icon" chip showing a person silhouette.
 * - Clicking "Account" opens a MUI Menu popover anchored below the button.
 * - Menu items include left icons:
 *     • Profile (person icon)   ← target
 *     • Billing (credit-card icon)
 *     • Sign out (door/exit icon)
 * - Initial state: Dashboard is active; no menu open.
 * - Selecting a menu item closes the popover and sets the selected_path (Account → <item>).
 * - No other clutter.
 * 
 * Success: The selected menu path is Account → Profile.
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Dashboard');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (
      selectedPath.length === 2 &&
      selectedPath[0] === 'Account' &&
      selectedPath[1] === 'Profile' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedPath(['Account', item]);
    handleClose();
  };

  return (
    <Paper elevation={2} sx={{ width: 500, overflow: 'hidden' }}>
      {/* Target icon reference */}
      <Box sx={{ p: 1.5, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ fontSize: 12, color: 'text.secondary' }}>Target icon:</Box>
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 32, 
            height: 32, 
            bgcolor: '#e3f2fd', 
            borderRadius: 1,
            border: '1px solid #90caf9',
          }}
          data-testid="target-icon"
        >
          <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} />
        </Box>
        <Box sx={{ fontSize: 12, color: 'text.secondary' }}>
          Account menu items: Profile (person), Billing (card), Sign out (door).
        </Box>
      </Box>

      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          {['Dashboard', 'Reports'].map((item) => (
            <Button
              key={item}
              onClick={() => setActiveKey(item)}
              aria-current={activeKey === item ? 'page' : undefined}
              sx={{
                color: activeKey === item ? 'primary.main' : 'text.secondary',
                borderBottom: activeKey === item ? '2px solid' : '2px solid transparent',
                borderColor: activeKey === item ? 'primary.main' : 'transparent',
                borderRadius: 0,
                px: 2,
              }}
            >
              {item}
            </Button>
          ))}
          <Button
            onClick={handleAccountClick}
            endIcon={<KeyboardArrowDownIcon />}
            aria-expanded={open}
            aria-haspopup="true"
            sx={{
              color: 'text.secondary',
              px: 2,
            }}
            data-testid="menubar-item-account"
          >
            Account
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            data-testid="menu-account"
          >
            <MenuItem onClick={() => handleMenuItemClick('Profile')} data-testid="menu-item-profile">
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Billing')} data-testid="menu-item-billing">
              <ListItemIcon>
                <CreditCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Billing</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Sign out')} data-testid="menu-item-signout">
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Paper>
  );
}
