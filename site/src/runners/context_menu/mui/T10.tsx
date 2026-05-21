'use client';

/**
 * context_menu-mui-T10: Compact small: Transform → Rotate → 90° clockwise
 *
 * Scene: theme=light, spacing=compact, layout=isolated_card, placement=center, scale=small, instances=1.
 *
 * Layout: isolated_card centered in the viewport.
 * Spacing/size: COMPACT spacing is enabled and the menu uses a SMALL scale.
 *
 * Target element: a small canvas shows a single labeled shape "Rectangle 1".
 * Right-clicking directly on the rectangle opens a custom context menu.
 *
 * Context menu: composed from MUI Menu components anchored to cursor position.
 * It supports multi-level submenus that open to the right.
 *
 * Menu structure:
 * - Duplicate
 * - Transform ▸
 *     - Rotate ▸
 *         - 90° clockwise
 *         - 90° counterclockwise
 *         - 180°
 *     - Flip ▸
 *         - Horizontal
 *         - Vertical
 * - Delete
 *
 * Success: The activated item path equals ['Transform', 'Rotate', '90° clockwise'].
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import { ChevronRight as ChevronRightIcon, CropSquare as RectIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
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

  const handleTopLevelClick = (item: string) => {
    setLastActivatedPath([item]);
    handleClose();
  };

  const handleRotateClick = (item: string) => {
    setLastActivatedPath(['Transform', 'Rotate', item]);
    handleClose();
  };

  const handleFlipClick = (item: string) => {
    setLastActivatedPath(['Transform', 'Flip', item]);
    handleClose();
  };

  const menuSx = {
    '& .MuiMenuItem-root': {
      fontSize: '12px',
      minHeight: 28,
      py: 0.5,
      px: 1.5,
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 1.5, width: 280 }}>
      <Typography variant="subtitle2" sx={{ fontSize: 12, mb: 1 }}>
        Canvas
      </Typography>

      <Box
        onContextMenu={handleContextMenu}
        sx={{
          width: '100%',
          height: 150,
          bgcolor: 'grey.100',
          borderRadius: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'context-menu',
          position: 'relative',
        }}
        data-testid="canvas-area"
        data-last-activated-path={lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
      >
        <Box
          sx={{
            width: 80,
            height: 50,
            bgcolor: 'primary.main',
            borderRadius: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-testid="rectangle-1"
        >
          <RectIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            fontSize: 10,
            color: 'text.secondary',
          }}
        >
          Rectangle 1
        </Typography>
      </Box>

      {/* Main context menu */}
      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        sx={menuSx}
        data-testid="context-menu-overlay"
      >
        <MenuItem onClick={() => handleTopLevelClick('Duplicate')}>Duplicate</MenuItem>
        <MenuItem
          onMouseEnter={(e) => {
            setTransformAnchor(e.currentTarget);
            setRotateAnchor(null);
            setFlipAnchor(null);
          }}
          data-testid="transform-item"
        >
          <Typography sx={{ flex: 1, fontSize: 12 }}>Transform</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon sx={{ fontSize: 14 }} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={() => handleTopLevelClick('Delete')}>Delete</MenuItem>
      </Menu>

      {/* Transform submenu */}
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
          <Typography sx={{ flex: 1, fontSize: 12 }}>Rotate</Typography>
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
          <Typography sx={{ flex: 1, fontSize: 12 }}>Flip</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon sx={{ fontSize: 14 }} />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      {/* Rotate submenu */}
      <Menu
        open={Boolean(rotateAnchor)}
        anchorEl={rotateAnchor}
        onClose={() => setRotateAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={menuSx}
        data-testid="rotate-submenu"
      >
        <MenuItem onClick={() => handleRotateClick('90° clockwise')}>90° clockwise</MenuItem>
        <MenuItem onClick={() => handleRotateClick('90° counterclockwise')}>90° counterclockwise</MenuItem>
        <MenuItem onClick={() => handleRotateClick('180°')}>180°</MenuItem>
      </Menu>

      {/* Flip submenu */}
      <Menu
        open={Boolean(flipAnchor)}
        anchorEl={flipAnchor}
        onClose={() => setFlipAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={menuSx}
        data-testid="flip-submenu"
      >
        <MenuItem onClick={() => handleFlipClick('Horizontal')}>Horizontal</MenuItem>
        <MenuItem onClick={() => handleFlipClick('Vertical')}>Vertical</MenuItem>
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: 10 }}>
        Last action: <strong data-testid="last-action-path">{lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}</strong>
      </Typography>
    </Paper>
  );
}
