'use client';

/**
 * menu_button-mui-T03: Reset theme to System default
 * 
 * Layout: isolated_card centered titled "Appearance".
 * There is one menu button labeled "Theme: Dark".
 * Clicking opens a Menu with three items: "Light", "Dark", "System default".
 * 
 * Selecting an item immediately applies it and updates the trigger label.
 * Initial state: Dark is applied.
 * Success: The Theme menu's selected value equals "System default".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

const themeOptions = ['Light', 'Dark', 'System default'];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [successTriggered, setSuccessTriggered] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (selectedTheme === 'System default' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedTheme, successTriggered, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option: string) => {
    setSelectedTheme(option);
    handleClose();
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Appearance</Typography>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          data-testid="menu-button-theme"
        >
          Theme: {selectedTheme}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {themeOptions.map(option => (
            <MenuItem
              key={option}
              onClick={() => handleSelect(option)}
              selected={option === selectedTheme}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </CardContent>
    </Card>
  );
}
