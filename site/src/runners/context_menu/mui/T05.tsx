'use client';

/**
 * context_menu-mui-T05: Widget menu: scroll to Open settings
 *
 * Scene: theme=light, spacing=comfortable, layout=dashboard, placement=center, scale=default, instances=1, clutter=medium.
 *
 * Layout: A dashboard page shows several widgets (cards) in a grid.
 *
 * Target element: the widget titled "Sales chart". Right-clicking anywhere on the widget body
 * opens a custom context menu.
 *
 * Context menu implementation: an onContextMenu handler opens a MUI Menu.
 * The menu has many items (~18 actions) and a max height, so it becomes scrollable.
 * The target item "Open settings" is near the bottom of the list and requires scrolling.
 *
 * Distractors/clutter: Other widgets exist (e.g., "Traffic", "Alerts"), but they do NOT open
 * a custom context menu in this scene.
 *
 * Success: The activated item path equals ['Open settings'] for the Sales chart widget context menu.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Divider } from '@mui/material';
import { BarChart, ShowChart, Notifications } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

const menuItems = [
  'Refresh',
  'Refresh automatically',
  'divider',
  'Duplicate widget',
  'Move up',
  'Move down',
  'Move to top',
  'Move to bottom',
  'divider',
  'Change visualization',
  'Edit query',
  'Set threshold',
  'divider',
  'Export data',
  'Copy as image',
  'Share widget',
  'divider',
  'Resize',
  'Open settings',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Open settings' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedItem, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
  };

  const handleMenuClick = (item: string) => {
    setLastActivatedItem(item);
    handleClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {/* Sales chart - has context menu */}
        <Paper
          elevation={2}
          onContextMenu={handleContextMenu}
          sx={{
            p: 2,
            cursor: 'context-menu',
            minHeight: 180,
          }}
          data-testid="widget-sales-chart"
          data-last-activated={lastActivatedItem}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Sales chart
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
            <BarChart sx={{ fontSize: 60, color: 'primary.main', opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" align="center">$24,500</Typography>
        </Paper>

        {/* Traffic - no context menu */}
        <Paper elevation={2} sx={{ p: 2, minHeight: 180 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Traffic
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
            <ShowChart sx={{ fontSize: 60, color: 'success.main', opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" align="center">12.4K visits</Typography>
        </Paper>

        {/* Alerts - no context menu */}
        <Paper elevation={2} sx={{ p: 2, minHeight: 180 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Alerts
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
            <Notifications sx={{ fontSize: 60, color: 'warning.main', opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" align="center">3 active</Typography>
        </Paper>
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        slotProps={{
          paper: {
            style: { maxHeight: 300 },
          },
        }}
        data-testid="context-menu-overlay"
      >
        {menuItems.map((item, index) =>
          item === 'divider' ? (
            <Divider key={`divider-${index}`} />
          ) : (
            <MenuItem key={item} onClick={() => handleMenuClick(item)}>
              {item}
            </MenuItem>
          )
        )}
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </Typography>
    </Box>
  );
}
