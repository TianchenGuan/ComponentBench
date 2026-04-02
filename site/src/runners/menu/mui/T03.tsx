'use client';

/**
 * menu-mui-T03: Toggle off Show archived in a menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A vertical menu built with MUI MenuList/MenuItem, labeled "View options".
 * - Each item has a leading checkbox indicator (checked/unchecked).
 *
 * Items and initial state:
 * - Show archived: ON (checked) ← target is to turn it OFF
 * - Show completed: OFF
 * - Compact mode: OFF
 *
 * Success: The "Show archived" menu toggle is OFF (unchecked).
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, ListItemIcon, Typography, Box, Checkbox } from '@mui/material';
import type { TaskComponentProps } from '../types';

interface ToggleState {
  'Show archived': boolean;
  'Show completed': boolean;
  'Compact mode': boolean;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleState>({
    'Show archived': true,
    'Show completed': false,
    'Compact mode': false,
  });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (!toggles['Show archived'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [toggles, successTriggered, onSuccess]);

  const handleToggle = (key: keyof ToggleState) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 320 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
        View options
      </Typography>
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <MenuList data-testid="menu-view-options">
          {(Object.keys(toggles) as Array<keyof ToggleState>).map((key) => (
            <MenuItem
              key={key}
              onClick={() => handleToggle(key)}
              data-testid={`menu-item-${key.toLowerCase().replace(/ /g, '-')}`}
              data-checked={toggles[key]}
            >
              <ListItemIcon>
                <Checkbox
                  checked={toggles[key]}
                  size="small"
                  disableRipple
                  tabIndex={-1}
                  sx={{ p: 0 }}
                />
              </ListItemIcon>
              {key}
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        {(Object.entries(toggles) as Array<[keyof ToggleState, boolean]>).map(([key, value]) => (
          <Typography
            key={key}
            variant="caption"
            color="text.secondary"
            display="block"
            data-testid={`status-${key.toLowerCase().replace(/ /g, '-')}`}
          >
            {key}: <strong>{value ? 'On' : 'Off'}</strong>
          </Typography>
        ))}
      </Box>
    </Paper>
  );
}
