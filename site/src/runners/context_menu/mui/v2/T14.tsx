'use client';

/**
 * context_menu-mui-v2-T14: Panel B — View submenu exact toggles
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon, Divider, Chip, Slider } from '@mui/material';
import { Check as CheckIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

type ViewState = { Preview: boolean; Toolbar: boolean; 'Word wrap': boolean; Errors: boolean };

export default function T14({ onSuccess }: TaskComponentProps) {
  const [views, setViews] = useState<Record<string, ViewState>>({
    'Panel A': { Preview: false, Toolbar: true, 'Word wrap': false, Errors: false },
    'Panel B': { Preview: false, Toolbar: true, 'Word wrap': false, Errors: false },
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [subAnchor, setSubAnchor] = useState<HTMLElement | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const b = views['Panel B'];

  useEffect(() => {
    if (
      b.Preview === true &&
      b.Toolbar === false &&
      b['Word wrap'] === true &&
      b.Errors === true &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [b, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent, panel: string) => {
    event.preventDefault();
    setActivePanel(panel);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setSubAnchor(null);
    setAnchorPosition(null);
    setActivePanel(null);
  };

  const toggle = (key: keyof ViewState) => {
    if (!activePanel) return;
    setViews((prev) => ({
      ...prev,
      [activePanel]: { ...prev[activePanel], [key]: !prev[activePanel][key] },
    }));
  };

  return (
    <Box sx={{ p: 1, maxWidth: 560 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
        {['Theme', 'Font', 'Tab size', 'Autosave'].map((c) => (
          <Chip key={c} label={c} size="small" variant="outlined" sx={{ height: 22, fontSize: 10 }} />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        Indent
      </Typography>
      <Slider size="small" defaultValue={50} sx={{ mb: 1, maxWidth: 200 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        {(['Panel A', 'Panel B'] as const).map((p) => (
          <Paper
            key={p}
            variant="outlined"
            onContextMenu={(e) => handleContextMenu(e, p)}
            sx={{ flex: 1, p: 1, minHeight: 120, cursor: 'context-menu' }}
            data-testid={`inspector-${p.replace(/\s/g, '-').toLowerCase()}`}
            data-instance-label={p}
            data-checked-items={JSON.stringify(views[p])}
          >
            <Typography variant="caption" fontWeight={600}>
              {p}
            </Typography>
            <Box sx={{ mt: 1, height: 60, bgcolor: 'grey.100', borderRadius: 1 }} />
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
        <MenuItem dense onClick={handleClose}>
          Refresh
        </MenuItem>
        <MenuItem dense onMouseEnter={(e) => setSubAnchor(e.currentTarget)}>
          <Typography sx={{ flex: 1, fontSize: 12 }}>View</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={handleClose}>
          Open in split view
        </MenuItem>
      </Menu>

      <Menu
        open={Boolean(subAnchor)}
        anchorEl={subAnchor}
        onClose={() => setSubAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        data-testid="view-submenu"
      >
        {activePanel &&
          (['Preview', 'Toolbar', 'Word wrap', 'Errors'] as const).map((k) => {
            const row = views[activePanel];
            const checked = row[k];
            return (
              <MenuItem key={k} dense onClick={() => toggle(k)}>
                {checked && (
                  <ListItemIcon>
                    <CheckIcon fontSize="small" />
                  </ListItemIcon>
                )}
                <Typography sx={{ pl: checked ? 0 : 4 }}>{k}</Typography>
              </MenuItem>
            );
          })}
      </Menu>
    </Box>
  );
}
