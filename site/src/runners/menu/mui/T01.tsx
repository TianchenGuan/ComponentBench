'use client';

/**
 * menu-mui-T01: Navigate to Team in a MenuList
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A persistent vertical menu built with MUI MenuList and MenuItem components, placed inside a Paper container.
 * - The menu is labeled "Navigation".
 *
 * Items:
 * - Home (initially selected/active)
 * - Projects
 * - Team
 * - Settings
 *
 * Feedback:
 * - The selected item is highlighted using MUI's selected styling.
 * - A text line to the right reads "Current page: …" and updates when selection changes.
 *
 * Success: The Navigation menu's selected item is "Team".
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const menuItems = ['Home', 'Projects', 'Team', 'Settings'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string>('Home');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedKey === 'Team' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedKey, successTriggered, onSuccess]);

  return (
    <Paper elevation={2} sx={{ p: 2, width: 500 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: '0 0 160px' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
            Navigation
          </Typography>
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <MenuList data-testid="menu-navigation">
              {menuItems.map((item) => (
                <MenuItem
                  key={item}
                  selected={selectedKey === item}
                  onClick={() => setSelectedKey(item)}
                  data-testid={`menu-item-${item.toLowerCase()}`}
                >
                  {item}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Current page: <strong data-testid="current-page">{selectedKey}</strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
