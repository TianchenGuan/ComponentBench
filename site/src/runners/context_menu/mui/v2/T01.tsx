'use client';

/**
 * context_menu-mui-v2-T01: Sales chart widget — scroll to Open settings
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Divider, Chip, TextField } from '@mui/material';
import { BarChart, ShowChart, Insights } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

const menuItems = [
  'Refresh',
  'Duplicate widget',
  'Move up',
  'Move down',
  'Change visualization',
  'Edit widget',
  'Set threshold',
  'divider',
  'Export data',
  'Copy as image',
  'Share widget',
  'divider',
  'Resize',
  'Open in new tab',
  'divider',
  'Open settings',
];

export default function T01({ onSuccess }: TaskComponentProps) {
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

  return (
    <Box sx={{ p: 1, maxWidth: 720, ml: 'auto', mr: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {['Q4', 'Region', 'Team', 'SKU', 'Channel'].map((c) => (
            <Chip key={c} label={c} size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />
          ))}
        </Box>
        <TextField size="small" placeholder="Filter dashboards…" fullWidth sx={{ mb: 1 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
          <Paper
            elevation={1}
            onContextMenu={handleContextMenu}
            sx={{ p: 1, cursor: 'context-menu', minHeight: 140 }}
            data-testid="widget-sales-chart"
            data-last-activated={lastActivatedItem}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              Sales chart
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
              <BarChart sx={{ fontSize: 44, color: 'primary.main', opacity: 0.55 }} />
            </Box>
            <Typography variant="body2" align="center" sx={{ fontSize: 13 }}>
              $24.5k
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 1, minHeight: 140 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              Traffic
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
              <ShowChart sx={{ fontSize: 44, color: 'success.main', opacity: 0.45 }} />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Paper elevation={0} variant="outlined" sx={{ width: 160, p: 1, flexShrink: 0 }}>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Insights sx={{ fontSize: 16 }} /> Insights
        </Typography>
        {[1, 2, 3].map((i) => (
          <Typography key={i} variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Sparkline {i} +2.3%
          </Typography>
        ))}
      </Paper>
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        slotProps={{ paper: { style: { maxHeight: 220 } } }}
        data-testid="context-menu-overlay"
      >
        {menuItems.map((item, index) =>
          item === 'divider' ? (
            <Divider key={`d-${index}`} />
          ) : (
            <MenuItem
              key={item}
              dense
              sx={{ fontSize: 12, minHeight: 30 }}
              onClick={() => {
                setLastActivatedItem(item);
                handleClose();
              }}
            >
              {item}
            </MenuItem>
          )
        )}
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }} data-testid="last-action">
        Last action: <strong>{lastActivatedItem || 'None'}</strong>
      </Typography>
    </Box>
  );
}
