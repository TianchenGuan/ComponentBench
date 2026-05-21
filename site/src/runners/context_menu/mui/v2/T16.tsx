'use client';

/**
 * context_menu-mui-v2-T16: Route 4 — Open in split view
 */

import React, { useState } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Chip, Divider } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const ROUTES = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5', 'Route 6'] as const;

export default function T16({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [lastItem, setLastItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const handleContextMenu = (event: React.MouseEvent, route: string) => {
    event.preventDefault();
    setActiveRoute(route);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
    setActiveRoute(null);
  };

  const clickItem = (label: string) => {
    const route = activeRoute;
    setLastItem(label);
    if (route === 'Route 4' && label === 'Open in split view' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 1, maxWidth: 400 }}>
      <Paper variant="outlined" sx={{ p: 1, mb: 1, maxHeight: 100, overflow: 'auto' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          Activity
        </Typography>
        {Array.from({ length: 8 }, (_, i) => (
          <Typography key={i} variant="caption" sx={{ display: 'block', fontSize: 10 }}>
            Event {i + 1} · sync · ok
          </Typography>
        ))}
      </Paper>
      <Paper variant="outlined" sx={{ p: 1, maxHeight: 160, overflow: 'auto' }} data-testid="routes-scroll">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
          <Chip label="GET" size="small" sx={{ height: 20, fontSize: 10 }} />
          <Chip label="v2" size="small" variant="outlined" sx={{ height: 20, fontSize: 10 }} />
        </Box>
        {ROUTES.map((r) => (
          <Box
            key={r}
            onContextMenu={(e) => handleContextMenu(e, r)}
            sx={{
              py: 0.5,
              px: 0.5,
              cursor: 'context-menu',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
            data-testid={`route-${r.replace(/\s/g, '-').toLowerCase()}`}
            data-instance-label={r}
            data-last-activated={r === 'Route 4' ? lastItem : undefined}
          >
            <Typography variant="caption" fontWeight={600}>
              {r}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
              200 · 2m ago
            </Typography>
          </Box>
        ))}
      </Paper>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense onClick={() => clickItem('Open')}>
          Open
        </MenuItem>
        <MenuItem dense onClick={() => clickItem('Open in split view')}>
          Open in split view
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={() => clickItem('Duplicate')}>
          Duplicate
        </MenuItem>
        <MenuItem dense onClick={() => clickItem('Archive')}>
          Archive
        </MenuItem>
      </Menu>
    </Box>
  );
}
