'use client';

/**
 * context_menu-mui-T06: Pick item by shortcut reference
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=mixed.
 *
 * Target element: a card titled "Link preview" shows a URL and a small preview.
 * Right-clicking inside the preview opens a custom context menu.
 *
 * Guidance element: a small "Reference" pill above the preview displays the keyboard shortcut text "Ctrl+Shift+L".
 * The goal text explains that this shortcut corresponds to "Copy link".
 *
 * Context menu: implemented with MUI Menu. Menu items show a right-aligned shortcut hint.
 *
 * Menu items (label — shortcut):
 * - Copy — Ctrl+C
 * - Copy link — Ctrl+Shift+L
 * - Copy as Markdown — Ctrl+M
 * - Open in new tab — Ctrl+Enter
 *
 * Success: The activated item path equals ['Copy link'] for the Link preview context menu.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Chip } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { label: 'Copy', shortcut: 'Ctrl+C' },
  { label: 'Copy link', shortcut: 'Ctrl+Shift+L' },
  { label: 'Copy as Markdown', shortcut: 'Ctrl+M' },
  { label: 'Open in new tab', shortcut: 'Ctrl+Enter' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
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

  const handleMenuClick = (item: string) => {
    setLastActivatedItem(item);
    handleClose();
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        Link preview
      </Typography>

      {/* Reference box */}
      <Chip
        label="Reference: Ctrl+Shift+L"
        size="small"
        color="primary"
        variant="outlined"
        sx={{ mb: 2 }}
        data-testid="reference-box"
      />

      <Box
        onContextMenu={handleContextMenu}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 1,
          cursor: 'context-menu',
        }}
        data-testid="link-preview"
        data-last-activated={lastActivatedItem}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LinkIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary.main">
            https://example.com/docs/getting-started
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: 'grey.100',
            borderRadius: 1,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="white" variant="h6">📄</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Getting Started Guide</Typography>
            <Typography variant="caption" color="text.secondary">
              Learn how to set up your project
            </Typography>
          </Box>
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
            onClick={() => handleMenuClick(item.label)}
            sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 220 }}
          >
            <span>{item.label}</span>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              {item.shortcut}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </Typography>
    </Paper>
  );
}
