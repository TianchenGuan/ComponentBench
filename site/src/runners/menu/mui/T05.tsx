'use client';

/**
 * menu-mui-T05: Select Export in the Right menu on a dashboard
 * 
 * Scene: theme=light, spacing=comfortable, layout=dashboard, placement=top_right, scale=default, instances=2.
 *
 * Components:
 * - A card titled "Admin tools" contains two side-by-side vertical menus:
 *   - "Left menu" (left column)
 *   - "Right menu" (right column)
 *
 * Items:
 * - Left menu: Overview (selected), Export, Import, Settings
 * - Right menu: Overview (selected), Export, Import, Settings
 *
 * Feedback:
 * - Each menu has its own line below it showing the selection.
 *
 * Success: In the menu labeled "Right menu", the selected item is "Export".
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, Typography, Box, Card, CardContent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const menuItems = ['Overview', 'Export', 'Import', 'Settings'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [leftSelected, setLeftSelected] = useState<string>('Overview');
  const [rightSelected, setRightSelected] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (rightSelected === 'Export' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [rightSelected, successTriggered, onSuccess]);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: 800 }}>
      {/* Dashboard clutter cards */}
      <Paper elevation={1} sx={{ p: 2, width: 150, height: 100 }}>
        <Typography variant="caption" color="text.secondary">Total Users</Typography>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 600, color: 'primary.main' }}>3,482</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, width: 150, height: 100 }}>
        <Typography variant="caption" color="text.secondary">Active Now</Typography>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 600, color: 'success.main' }}>247</Typography>
      </Paper>

      {/* Admin tools card with two menus */}
      <Card sx={{ width: 450 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Admin tools</Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Left Menu */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
                Left menu
              </Typography>
              <Paper variant="outlined">
                <MenuList data-testid="left-menu">
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item}
                      selected={leftSelected === item}
                      onClick={() => setLeftSelected(item)}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Left menu selected: <strong data-testid="left-menu-selected">{leftSelected}</strong>
              </Typography>
            </Box>

            {/* Right Menu */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
                Right menu
              </Typography>
              <Paper variant="outlined">
                <MenuList data-testid="right-menu">
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item}
                      selected={rightSelected === item}
                      onClick={() => setRightSelected(item)}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Right menu selected: <strong data-testid="right-menu-selected">{rightSelected}</strong>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
