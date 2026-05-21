'use client';

/**
 * menu-mui-T04: Select nested path Account → Security → Two-factor authentication
 * 
 * Scene: theme=dark, spacing=comfortable, layout=settings_panel, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A MUI Menu-based nested menu system displayed open by default.
 * - Top-level menu contains several items; one item ("Security") opens a nested submenu to the side.
 *
 * Structure:
 * - Account (top-level label; shown as the menu title header)
 *   - Profile
 *   - Security ▶ (opens submenu)
 *   - Billing
 * - Security submenu
 *   - Password
 *   - Two-factor authentication ← target leaf
 *   - Sessions
 *
 * Initial state:
 * - Only the top-level menu is visible; the Security submenu is closed.
 * - No leaf is selected.
 *
 * Success: The selected leaf path equals ["Account", "Security", "Two-factor authentication"].
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Typography, Box, Collapse } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

// Map of leaf keys to their full paths
const pathMap: Record<string, string[]> = {
  'Profile': ['Account', 'Profile'],
  'Billing': ['Account', 'Billing'],
  'Password': ['Account', 'Security', 'Password'],
  'Two-factor authentication': ['Account', 'Security', 'Two-factor authentication'],
  'Sessions': ['Account', 'Security', 'Sessions'],
};

export default function T04({ onSuccess }: TaskComponentProps) {
  const [securityOpen, setSecurityOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const selectedPath = selectedKey ? pathMap[selectedKey] : null;

  useEffect(() => {
    if (
      selectedPath &&
      selectedPath.length === 3 &&
      selectedPath[0] === 'Account' &&
      selectedPath[1] === 'Security' &&
      selectedPath[2] === 'Two-factor authentication' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleLeafClick = (key: string) => {
    setSelectedKey(key);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: 400,
        bgcolor: 'grey.900',
        color: 'grey.100',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'grey.500' }}>
          Selected: <strong data-testid="selected-path">{selectedPath ? selectedPath.join(' / ') : 'None'}</strong>
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ color: 'grey.500', mb: 1, display: 'block', fontWeight: 500 }}>
        Account
      </Typography>

      <Paper variant="outlined" sx={{ bgcolor: 'grey.800', borderColor: 'grey.700' }}>
        <MenuList data-testid="menu-account">
          <MenuItem
            onClick={() => handleLeafClick('Profile')}
            selected={selectedKey === 'Profile'}
            sx={{ color: 'grey.100', '&.Mui-selected': { bgcolor: 'grey.700' } }}
          >
            Profile
          </MenuItem>

          <MenuItem
            onClick={() => setSecurityOpen(!securityOpen)}
            sx={{ color: 'grey.100' }}
          >
            <ListItemText>Security</ListItemText>
            <ListItemIcon sx={{ minWidth: 'auto', color: 'grey.400' }}>
              {securityOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
          </MenuItem>

          <Collapse in={securityOpen}>
            <MenuList sx={{ pl: 2 }} data-testid="submenu-security">
              <MenuItem
                onClick={() => handleLeafClick('Password')}
                selected={selectedKey === 'Password'}
                sx={{ color: 'grey.100', '&.Mui-selected': { bgcolor: 'grey.700' } }}
              >
                Password
              </MenuItem>
              <MenuItem
                onClick={() => handleLeafClick('Two-factor authentication')}
                selected={selectedKey === 'Two-factor authentication'}
                sx={{ color: 'grey.100', '&.Mui-selected': { bgcolor: 'grey.700' } }}
              >
                Two-factor authentication
              </MenuItem>
              <MenuItem
                onClick={() => handleLeafClick('Sessions')}
                selected={selectedKey === 'Sessions'}
                sx={{ color: 'grey.100', '&.Mui-selected': { bgcolor: 'grey.700' } }}
              >
                Sessions
              </MenuItem>
            </MenuList>
          </Collapse>

          <MenuItem
            onClick={() => handleLeafClick('Billing')}
            selected={selectedKey === 'Billing'}
            sx={{ color: 'grey.100', '&.Mui-selected': { bgcolor: 'grey.700' } }}
          >
            Billing
          </MenuItem>
        </MenuList>
      </Paper>
    </Paper>
  );
}
