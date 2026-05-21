'use client';

/**
 * menu-mui-T06: Match a reference icon to the correct menu item
 * 
 * Scene: theme=light, spacing=compact, layout=isolated_card, placement=center, scale=small, instances=1.
 *
 * Left: a "Target" card shows a single large icon as the reference (a star).
 *
 * Right: a vertical menu built with MUI MenuList and MenuItems, rendered in compact spacing and small size.
 * Each menu item has a leading icon:
 * - Favorites (star icon)
 * - History (clock icon)
 * - Downloads (down arrow icon)
 * - Share (share icon)
 *
 * Initial state:
 * - No item is selected.
 *
 * Success: The selected menu item matches the star icon reference (Favorites).
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, ListItemIcon, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Favorites', label: 'Favorites', icon: <StarIcon fontSize="small" /> },
  { key: 'History', label: 'History', icon: <HistoryIcon fontSize="small" /> },
  { key: 'Downloads', label: 'Downloads', icon: <DownloadIcon fontSize="small" /> },
  { key: 'Share', label: 'Share', icon: <ShareIcon fontSize="small" /> },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedKey === 'Favorites' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedKey, successTriggered, onSuccess]);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      {/* Target Card */}
      <Paper elevation={2} sx={{ p: 2, width: 100, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Target
        </Typography>
        <StarIcon sx={{ fontSize: 48, color: 'primary.main' }} data-testid="target-icon" />
      </Paper>

      {/* Menu */}
      <Paper elevation={2} sx={{ width: 180 }}>
        <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Quick access
          </Typography>
        </Box>
        <MenuList dense data-testid="menu-quick-access">
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              selected={selectedKey === item.key}
              onClick={() => setSelectedKey(item.key)}
              sx={{ fontSize: '0.8rem' }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {item.icon}
              </ListItemIcon>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
        <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Selected: <strong data-testid="selected-item">{selectedKey || 'None'}</strong>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
