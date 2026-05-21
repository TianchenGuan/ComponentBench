'use client';

/**
 * context_menu-mui-v2-T15: Tile 4 — pick Print by printer icon (Reference)
 */

import React, { useState } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import {
  FolderOpen as FolderOpenIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

export default function T15({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [lastItem, setLastItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const handleContextMenu = (event: React.MouseEvent, tile: string) => {
    event.preventDefault();
    setActiveTile(tile);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
    setActiveTile(null);
  };

  const pick = (label: string) => {
    const tile = activeTile;
    setLastItem(label);
    if (tile === 'Tile 4' && label === 'Print' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Paper
        variant="outlined"
        sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
        data-testid="reference-box"
      >
        <Typography variant="caption" color="text.secondary">
          Reference
        </Typography>
        <PrintIcon fontSize="small" color="action" aria-label="printer" />
      </Paper>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, maxWidth: 400 }}>
        {(['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4'] as const).map((t) => (
          <Paper
            key={t}
            elevation={1}
            onContextMenu={(e) => handleContextMenu(e, t)}
            sx={{ p: 1, cursor: 'context-menu', minHeight: 64 }}
            data-testid={t.replace(/\s/g, '-').toLowerCase()}
            data-instance-label={t}
            data-last-activated={t === 'Tile 4' ? lastItem : undefined}
          >
            <Typography variant="caption" fontWeight={600}>
              {t}
            </Typography>
            <Box sx={{ height: 36, bgcolor: 'grey.200', borderRadius: 0.5, mt: 0.5 }} />
          </Paper>
        ))}
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense onClick={() => pick('Open')}>
          <ListItemIcon>
            <FolderOpenIcon fontSize="small" />
          </ListItemIcon>
          Open
        </MenuItem>
        <MenuItem dense onClick={() => pick('Download')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem dense onClick={() => pick('Print')}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          Print
        </MenuItem>
        <MenuItem dense onClick={() => pick('Share')}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          Share
        </MenuItem>
      </Menu>
    </Box>
  );
}
