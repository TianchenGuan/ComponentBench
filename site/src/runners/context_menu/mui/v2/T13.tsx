'use client';

/**
 * context_menu-mui-v2-T13: Card 2 — Visibility → Internal
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Divider, ListSubheader } from '@mui/material';
import type { TaskComponentProps } from '../../types';

type Vis = 'Public' | 'Internal' | 'Private';

export default function T13({ onSuccess }: TaskComponentProps) {
  const [vis, setVis] = useState<Record<string, Vis>>({
    'Card 1': 'Public',
    'Card 2': 'Public',
    'Card 3': 'Public',
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (vis['Card 2'] === 'Internal' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [vis, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent, card: string) => {
    event.preventDefault();
    setActiveCard(card);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorPosition(null);
    setActiveCard(null);
  };

  const v = activeCard ? vis[activeCard] : 'Public';

  return (
    <Paper elevation={2} sx={{ p: 1.5, width: 520 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 13 }}>
        Project board
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {(['Card 1', 'Card 2', 'Card 3'] as const).map((c) => (
          <Paper
            key={c}
            variant="outlined"
            onContextMenu={(e) => handleContextMenu(e, c)}
            sx={{ flex: 1, p: 1, cursor: 'context-menu', minHeight: 72 }}
            data-testid={`project-card-${c.replace(/\s/g, '-').toLowerCase()}`}
            data-instance-label={c}
            data-radio-groups={JSON.stringify({ Visibility: vis[c] })}
          >
            <Typography variant="caption" fontWeight={600}>
              {c}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 10 }}>
              {vis[c]}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        slotProps={{ list: { dense: true } }}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense onClick={handleClose}>
          Open
        </MenuItem>
        <ListSubheader sx={{ fontSize: 10, lineHeight: '22px' }}>Visibility</ListSubheader>
        {(['Public', 'Internal', 'Private'] as const).map((opt) => (
          <MenuItem
            key={opt}
            dense
            selected={v === opt}
            sx={{ fontSize: 11, pl: 2 }}
            onClick={() => {
              if (activeCard) setVis((prev) => ({ ...prev, [activeCard]: opt }));
            }}
          >
            {opt}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem dense onClick={handleClose}>
          Move
        </MenuItem>
        <MenuItem dense onClick={handleClose}>
          Archive
        </MenuItem>
      </Menu>
    </Paper>
  );
}
