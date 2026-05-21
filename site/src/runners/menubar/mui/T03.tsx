'use client';

/**
 * menubar-mui-T03: Turn OFF View → Dense mode
 * 
 * Layout: isolated_card, centered.
 * MUI AppBar/Toolbar menubar with buttons: File, Edit, View (dropdown), Help.
 * - Clicking "View" opens a MUI Menu popover.
 * - Inside the View menu are three checkable items with a checkbox indicator on the left:
 *     • Dense mode (initially ON)   ← target is to turn it OFF
 *     • Show line numbers (initially OFF)
 *     • Wrap text (initially ON)
 * - Toggling an item updates its checkbox indicator immediately; no Apply button.
 * - Initial state: no menus open.
 * 
 * Success: The toggle state for "Dense mode" is OFF.
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

interface ToggleStates {
  'Dense mode': boolean;
  'Show line numbers': boolean;
  'Wrap text': boolean;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleStates>({
    'Dense mode': true,
    'Show line numbers': false,
    'Wrap text': true,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!toggles['Dense mode'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [toggles, successTriggered, onSuccess]);

  const handleViewClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (key: keyof ToggleStates) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Paper elevation={2} sx={{ width: 500, overflow: 'hidden' }}>
      <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
        View menu: Dense mode [ON], Show line numbers [OFF], Wrap text [ON]
      </Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          {['File', 'Edit'].map((item) => (
            <Button key={item} sx={{ color: 'text.secondary', px: 2 }}>
              {item}
            </Button>
          ))}
          <Button
            onClick={handleViewClick}
            endIcon={<KeyboardArrowDownIcon />}
            aria-expanded={open}
            aria-haspopup="true"
            sx={{ color: 'text.secondary', px: 2 }}
            data-testid="menubar-item-view"
          >
            View
          </Button>
          <Button sx={{ color: 'text.secondary', px: 2 }}>Help</Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            data-testid="menu-view"
          >
            {(Object.keys(toggles) as Array<keyof ToggleStates>).map((key) => (
              <MenuItem
                key={key}
                onClick={() => handleToggle(key)}
                data-testid={`menu-item-${key.toLowerCase().replace(/ /g, '-')}`}
              >
                <Checkbox
                  checked={toggles[key]}
                  size="small"
                  sx={{ p: 0, mr: 1 }}
                  tabIndex={-1}
                />
                <ListItemText>{key}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Paper>
  );
}
