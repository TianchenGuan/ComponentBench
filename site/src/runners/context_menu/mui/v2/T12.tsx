'use client';

/**
 * context_menu-mui-v2-T12: Payload preview — Export JSON via Ctrl+Alt+J cue
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Chip } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const items = [
  { label: 'Copy value', shortcut: 'Ctrl+C' },
  { label: 'Copy path', shortcut: 'Ctrl+Shift+P' },
  { label: 'Export JSON', shortcut: 'Ctrl+Alt+J' },
  { label: 'Export CSV', shortcut: 'Ctrl+Alt+C' },
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [lastItem, setLastItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastItem === 'Export JSON' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastItem, successTriggered, onSuccess]);

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
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
      <Paper elevation={2} sx={{ p: 1.5, width: 340 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {['errors: 0', 'p95: 120ms', 'region: us'].map((c) => (
            <Chip key={c} label={c} size="small" variant="outlined" sx={{ height: 20, fontSize: 10 }} />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          Payload preview
        </Typography>
        <Chip
          label="Reference: Ctrl+Alt+J"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ display: 'block', width: 'fit-content', mt: 0.5, mb: 1, height: 22, fontSize: 11 }}
          data-testid="reference-box"
        />
        <Box
          onContextMenu={handleContextMenu}
          sx={{
            p: 1,
            bgcolor: 'grey.100',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: 11,
            cursor: 'context-menu',
          }}
          data-testid="payload-preview"
          data-last-activated={lastItem}
        >
          {'{ "id": 7, "status": "ok" }'}
        </Box>

        <Menu
          open={menuOpen}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition ?? undefined}
          data-testid="context-menu-overlay"
        >
          {items.map((it) => (
            <MenuItem
              key={it.label}
              dense
              sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 240, fontSize: 12 }}
              onClick={() => {
                setLastItem(it.label);
                handleClose();
              }}
            >
              <span>{it.label}</span>
              <Typography variant="caption" color="text.secondary">
                {it.shortcut}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </Box>
  );
}
