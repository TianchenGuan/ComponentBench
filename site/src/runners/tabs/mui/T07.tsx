'use client';

/**
 * tabs-mui-T07: Icon-only tabs: match target icon
 *
 * Layout: isolated_card centered titled "Quick Actions".
 * Component: MUI Tabs with four icon-only Tab items (no visible text labels).
 * Icons are distinct (e.g., Home, Search, Notifications bell, Settings gear). Each tab still has an accessible name via aria-label.
 * Initial state: the first icon tab (Home) is selected.
 * Above the tab bar is a small reference area labeled "Target" that displays a single icon. The icon matches exactly one of the tab icons.
 * No other interactive components on the page.
 * Success: Selected tab is the Notifications bell tab (value/key: notifications).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography, Chip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('home');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'notifications') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        
        {/* Target reference */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption">Target:</Typography>
                <NotificationsIcon fontSize="small" />
              </Box>
            }
            variant="outlined"
          />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="Quick Actions tabs" centered>
            <Tab icon={<HomeIcon />} value="home" aria-label="Home" />
            <Tab icon={<SearchIcon />} value="search" aria-label="Search" />
            <Tab icon={<NotificationsIcon />} value="notifications" aria-label="Notifications" />
            <Tab icon={<SettingsIcon />} value="settings" aria-label="Settings" />
          </Tabs>
        </Box>
        <Box sx={{ pt: 2 }}>
          <Typography>
            {value === 'home' && 'Home panel'}
            {value === 'search' && 'Search panel'}
            {value === 'notifications' && 'Notifications panel'}
            {value === 'settings' && 'Settings panel'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
