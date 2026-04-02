'use client';

/**
 * context_menu-mui-v2-T02: Link preview — pick Copy link by shortcut Ctrl+Shift+L
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Chip } from '@mui/material';
import { Link as LinkIcon, Description } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

const menuItems = [
  { label: 'Copy', shortcut: 'Ctrl+C' },
  { label: 'Copy link', shortcut: 'Ctrl+Shift+L' },
  { label: 'Copy as Markdown', shortcut: 'Ctrl+M' },
  { label: 'Open in new tab', shortcut: 'Ctrl+Enter' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Copy link' && !successTriggered) {
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
    <Box sx={{ p: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
      <Paper variant="outlined" sx={{ p: 1, width: 120, flexShrink: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Metadata
        </Typography>
        <Chip label="v2" size="small" sx={{ mt: 0.5, height: 20, fontSize: 10 }} />
      </Paper>
      <Paper elevation={2} sx={{ p: 1.5, width: 320 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 13 }}>
          Link preview
        </Typography>
        <Chip
          label="Reference: Ctrl+Shift+L"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mb: 1, height: 22, fontSize: 11 }}
          data-testid="reference-box"
        />
        <Box
          onContextMenu={handleContextMenu}
          sx={{ p: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, cursor: 'context-menu' }}
          data-testid="link-preview"
          data-last-activated={lastActivatedItem}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <LinkIcon sx={{ fontSize: 16 }} color="primary" />
            <Typography variant="caption" color="primary.main">
              https://example.com/page
            </Typography>
          </Box>
          <Box sx={{ bgcolor: 'grey.100', borderRadius: 1, p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Description color="disabled" />
            <Typography variant="caption">Preview body</Typography>
          </Box>
        </Box>
        <Menu
          open={menuOpen}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition ?? undefined}
          data-testid="context-menu-overlay"
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              dense
              sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 240, fontSize: 12 }}
              onClick={() => {
                setLastActivatedItem(item.label);
                handleClose();
              }}
            >
              <span>{item.label}</span>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {item.shortcut}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }} data-testid="last-action">
          {lastActivatedItem || 'None'}
        </Typography>
      </Paper>
    </Box>
  );
}
