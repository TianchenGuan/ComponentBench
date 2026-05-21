'use client';

/**
 * menubar-mui-T01: Go to Analytics (AppBar buttons)
 * 
 * Layout: isolated_card, centered.
 * A mock application header is built with MUI AppBar and Toolbar. Inside the Toolbar are four text buttons acting as a menubar:
 * Home, Projects, Analytics, Settings.
 * - Clicking a button sets it as the active section (visual underline + aria-current on the active button).
 * - Initial state: Home is active.
 * - No dropdown menus in this task; no additional clutter.
 * 
 * Success: The menubar's active item is "Analytics".
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const menuItems = ['Home', 'Projects', 'Analytics', 'Settings'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Home');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Analytics' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 500, overflow: 'hidden' }}>
      <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
        App menu bar: Home · Projects · Analytics · Settings
      </Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          {menuItems.map((item) => (
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
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              data-testid={`menubar-item-${item.toLowerCase()}`}
            >
              {item}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}
