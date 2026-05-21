'use client';

/**
 * context_menu-mui-T07: Dark theme: Share → Email
 *
 * Scene: theme=dark, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a photo tile labeled "Photo 7". Right-clicking the tile opens a custom context menu.
 *
 * Implementation: MUI Menu is opened via onContextMenu and anchored to cursor coordinates.
 * A nested submenu is composed using a second Menu/Popover that opens when the parent item is hovered/focused.
 *
 * Menu structure:
 * - Open
 * - Share ▸
 *     - Email
 *     - Copy link
 * - Delete
 *
 * Success: The activated item path equals ['Share', 'Email'] for the Photo 7 context menu.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import { ChevronRight as ChevronRightIcon, Photo as PhotoIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setSubMenuAnchor(null);
    setAnchorPosition(null);
  };

  const handleShareHover = (event: React.MouseEvent<HTMLElement>) => {
    setSubMenuAnchor(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchor(null);
  };

  const handleSubMenuClick = (item: string) => {
    setLastActivatedPath(['Share', item]);
    handleClose();
  };

  const handleTopLevelClick = (item: string) => {
    if (item !== 'Share') {
      setLastActivatedPath([item]);
      handleClose();
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        width: 350,
        bgcolor: 'grey.900',
        color: 'grey.100',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Gallery
      </Typography>

      <Box
        onContextMenu={handleContextMenu}
        sx={{
          p: 2,
          bgcolor: 'grey.800',
          borderRadius: 1,
          cursor: 'context-menu',
          textAlign: 'center',
        }}
        data-testid="photo-tile"
        data-last-activated-path={lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
      >
        <Box
          sx={{
            width: '100%',
            height: 180,
            bgcolor: 'grey.700',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <PhotoIcon sx={{ fontSize: 60, color: 'grey.500' }} />
        </Box>
        <Typography variant="body2">Photo 7</Typography>
        <Typography variant="caption" color="grey.500">
          Right-click for options
        </Typography>
      </Box>

      {/* Main context menu */}
      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem onClick={() => handleTopLevelClick('Open')}>Open</MenuItem>
        <MenuItem
          onMouseEnter={handleShareHover}
          onClick={() => setSubMenuAnchor(subMenuAnchor ? null : document.body)}
          data-testid="share-menu-item"
        >
          <Typography sx={{ flex: 1 }}>Share</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={() => handleTopLevelClick('Delete')}>Delete</MenuItem>
      </Menu>

      {/* Share submenu */}
      <Menu
        open={Boolean(subMenuAnchor)}
        anchorEl={subMenuAnchor}
        onClose={handleSubMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        data-testid="share-submenu"
      >
        <MenuItem onClick={() => handleSubMenuClick('Email')}>Email</MenuItem>
        <MenuItem onClick={() => handleSubMenuClick('Copy link')}>Copy link</MenuItem>
      </Menu>

      <Typography variant="caption" color="grey.500" sx={{ display: 'block', mt: 2 }}>
        Last action path: <strong data-testid="last-action-path">{lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}</strong>
      </Typography>
    </Paper>
  );
}
