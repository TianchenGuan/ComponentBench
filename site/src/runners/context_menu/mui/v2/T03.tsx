'use client';

/**
 * context_menu-mui-v2-T03: Photo 7 — Share → Email (dark modal)
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { ChevronRight as ChevronRightIcon, Photo as PhotoIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [subMenuAnchor, setSubMenuAnchor] = useState<HTMLElement | null>(null);
  const [lastActivatedPath, setLastActivatedPath] = useState<string[] | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      lastActivatedPath &&
      lastActivatedPath.length === 2 &&
      lastActivatedPath[0] === 'Share' &&
      lastActivatedPath[1] === 'Email' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedPath, successTriggered, onSuccess]);

  const handlePhoto7ContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setSubMenuAnchor(null);
    setAnchorPosition(null);
  };

  const handleSubMenuClick = (item: string) => {
    setLastActivatedPath(['Share', item]);
    handleClose();
  };

  return (
    <Dialog open maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: 'grey.900', color: 'grey.100' } }}>
      <DialogTitle sx={{ fontSize: 16 }}>Media picker</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {['All', 'PNG', 'Recent'].map((f) => (
            <Typography key={f} variant="caption" sx={{ px: 1, py: 0.25, bgcolor: 'grey.800', borderRadius: 1 }}>
              {f}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Box
              key={n}
              onContextMenu={n === 7 ? handlePhoto7ContextMenu : undefined}
              sx={{
                p: 1,
                bgcolor: 'grey.800',
                borderRadius: 1,
                textAlign: 'center',
                cursor: n === 7 ? 'context-menu' : 'default',
              }}
              data-testid={n === 7 ? 'photo-tile-7' : `photo-tile-${n}`}
              data-last-activated-path={n === 7 && lastActivatedPath ? lastActivatedPath.join(' → ') : undefined}
            >
              <Box
                sx={{
                  height: 56,
                  bgcolor: 'grey.700',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 0.5,
                }}
              >
                <PhotoIcon sx={{ color: 'grey.500' }} />
              </Box>
              <Typography variant="caption">{n === 7 ? 'Photo 7' : `Photo ${n}`}</Typography>
            </Box>
          ))}
        </Box>

        <Menu
          open={menuOpen}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition ?? undefined}
          data-testid="context-menu-overlay"
        >
          <MenuItem onClick={() => { setLastActivatedPath(['Open']); handleClose(); }}>Open</MenuItem>
          <MenuItem onMouseEnter={(e) => setSubMenuAnchor(e.currentTarget)} data-testid="share-menu-item">
            <Typography sx={{ flex: 1 }}>Share</Typography>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <ChevronRightIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={() => { setLastActivatedPath(['Copy metadata']); handleClose(); }}>Copy metadata</MenuItem>
          <MenuItem onClick={() => { setLastActivatedPath(['Delete']); handleClose(); }}>Delete</MenuItem>
        </Menu>

        <Menu
          open={Boolean(subMenuAnchor)}
          anchorEl={subMenuAnchor}
          onClose={() => setSubMenuAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          data-testid="share-submenu"
        >
          <MenuItem onClick={() => handleSubMenuClick('Email')}>Email</MenuItem>
          <MenuItem onClick={() => handleSubMenuClick('Copy link')}>Copy link</MenuItem>
        </Menu>

        <Typography variant="caption" color="grey.500" sx={{ display: 'block', mt: 2 }} data-testid="last-action-path">
          {lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
