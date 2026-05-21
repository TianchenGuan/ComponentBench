'use client';

/**
 * context_menu-mui-v2-T06: Rectangle 1 — Transform → Rotate → 90° clockwise
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon, Chip } from '@mui/material';
import { ChevronRight as ChevronRightIcon, CropSquare as RectIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [transformAnchor, setTransformAnchor] = useState<HTMLElement | null>(null);
  const [rotateAnchor, setRotateAnchor] = useState<HTMLElement | null>(null);
  const [flipAnchor, setFlipAnchor] = useState<HTMLElement | null>(null);
  const [lastActivatedPath, setLastActivatedPath] = useState<string[] | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      lastActivatedPath &&
      lastActivatedPath.length === 3 &&
      lastActivatedPath[0] === 'Transform' &&
      lastActivatedPath[1] === 'Rotate' &&
      lastActivatedPath[2] === '90° clockwise' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedPath, successTriggered, onSuccess]);

  const handleShapeContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setTransformAnchor(null);
    setRotateAnchor(null);
    setFlipAnchor(null);
    setAnchorPosition(null);
  };

  const menuSx = {
    '& .MuiMenuItem-root': {
      fontSize: 11,
      minHeight: 26,
      py: 0.25,
      px: 1,
    },
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: 280, p: 1 }}>
      <Paper elevation={2} sx={{ p: 1, width: 260 }}>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5, flexWrap: 'wrap' }}>
          <Chip label="L1" size="small" sx={{ height: 20, fontSize: 10 }} />
          <Chip label="Group A" size="small" sx={{ height: 20, fontSize: 10 }} variant="outlined" />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
          x: 120 y: 88
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 130,
            bgcolor: 'grey.100',
            borderRadius: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            mt: 0.5,
          }}
          data-testid="canvas-area"
        >
          <Box
            onContextMenu={handleShapeContextMenu}
            sx={{
              width: 72,
              height: 44,
              bgcolor: 'primary.main',
              borderRadius: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'context-menu',
            }}
            data-testid="rectangle-1"
            data-last-activated-path={lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
          >
            <RectIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography variant="caption" sx={{ position: 'absolute', bottom: 4, left: 4, fontSize: 10 }}>
            Rectangle 1
          </Typography>
        </Box>

        <Menu
          open={menuOpen}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition ?? undefined}
          sx={menuSx}
          data-testid="context-menu-overlay"
        >
          <MenuItem onClick={() => { setLastActivatedPath(['Duplicate']); handleClose(); }}>Duplicate</MenuItem>
          <MenuItem
            onMouseEnter={(e) => {
              setTransformAnchor(e.currentTarget);
              setRotateAnchor(null);
              setFlipAnchor(null);
            }}
            data-testid="transform-item"
          >
            <Typography sx={{ flex: 1, fontSize: 11 }}>Transform</Typography>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <ChevronRightIcon sx={{ fontSize: 14 }} />
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={() => { setLastActivatedPath(['Delete']); handleClose(); }}>Delete</MenuItem>
        </Menu>

        <Menu
          open={Boolean(transformAnchor)}
          anchorEl={transformAnchor}
          onClose={() => setTransformAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={menuSx}
          data-testid="transform-submenu"
        >
          <MenuItem
            onMouseEnter={(e) => {
              setRotateAnchor(e.currentTarget);
              setFlipAnchor(null);
            }}
            data-testid="rotate-item"
          >
            <Typography sx={{ flex: 1 }}>Rotate</Typography>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <ChevronRightIcon sx={{ fontSize: 14 }} />
            </ListItemIcon>
          </MenuItem>
          <MenuItem
            onMouseEnter={(e) => {
              setFlipAnchor(e.currentTarget);
              setRotateAnchor(null);
            }}
            data-testid="flip-item"
          >
            <Typography sx={{ flex: 1 }}>Flip</Typography>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <ChevronRightIcon sx={{ fontSize: 14 }} />
            </ListItemIcon>
          </MenuItem>
        </Menu>

        <Menu
          open={Boolean(rotateAnchor)}
          anchorEl={rotateAnchor}
          onClose={() => setRotateAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={menuSx}
          data-testid="rotate-submenu"
        >
          <MenuItem onClick={() => { setLastActivatedPath(['Transform', 'Rotate', '90° clockwise']); handleClose(); }}>
            90° clockwise
          </MenuItem>
          <MenuItem onClick={() => { setLastActivatedPath(['Transform', 'Rotate', '90° counterclockwise']); handleClose(); }}>
            90° counterclockwise
          </MenuItem>
          <MenuItem onClick={() => { setLastActivatedPath(['Transform', 'Rotate', '180°']); handleClose(); }}>180°</MenuItem>
        </Menu>

        <Menu
          open={Boolean(flipAnchor)}
          anchorEl={flipAnchor}
          onClose={() => setFlipAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={menuSx}
          data-testid="flip-submenu"
        >
          <MenuItem onClick={() => { setLastActivatedPath(['Transform', 'Flip', 'Horizontal']); handleClose(); }}>
            Horizontal
          </MenuItem>
          <MenuItem onClick={() => { setLastActivatedPath(['Transform', 'Flip', 'Vertical']); handleClose(); }}>
            Vertical
          </MenuItem>
        </Menu>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: 10 }} data-testid="last-action-path">
          {lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
        </Typography>
      </Paper>
    </Box>
  );
}
