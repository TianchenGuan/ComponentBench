'use client';

/**
 * menubar-mui-T05: Match star icon (Favorites)
 * 
 * Layout: isolated_card, centered.
 * A MUI AppBar/Toolbar menubar includes mixed icon+text buttons:
 * - Home (house icon)
 * - Favorites (star icon)   ← target
 * - Notifications (bell icon)
 * - Settings (gear icon)
 * Above the menubar, a small reference chip labeled "Target icon" displays the star icon.
 * - Initial state: Home is active.
 * - Clicking a button sets it active (underline + aria-current).
 * - No dropdown menus; focus is icon matching and correct activation.
 * 
 * Success: The menubar's active item is "Favorites".
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Home', label: 'Home', icon: <HomeIcon fontSize="small" /> },
  { key: 'Favorites', label: 'Favorites', icon: <StarIcon fontSize="small" /> },
  { key: 'Notifications', label: 'Notifications', icon: <NotificationsIcon fontSize="small" /> },
  { key: 'Settings', label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Home');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Favorites' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 550, overflow: 'hidden' }}>
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
            bgcolor: '#fff8e1', 
            borderRadius: 1,
            border: '1px solid #ffe082',
          }}
          data-testid="target-icon"
        >
          <StarIcon sx={{ fontSize: 20, color: '#ffc107' }} />
        </Box>
        <Box sx={{ fontSize: 12, color: 'text.secondary' }}>
          Click Favorites (★) in the app menu bar.
        </Box>
      </Box>

      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          {menuItems.map((item) => (
            <Button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              startIcon={item.icon}
              aria-current={activeKey === item.key ? 'page' : undefined}
              sx={{
                color: activeKey === item.key ? 'primary.main' : 'text.secondary',
                borderBottom: activeKey === item.key ? '2px solid' : '2px solid transparent',
                borderColor: activeKey === item.key ? 'primary.main' : 'transparent',
                borderRadius: 0,
                px: 2,
              }}
              data-testid={`menubar-item-${item.key.toLowerCase()}`}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}
