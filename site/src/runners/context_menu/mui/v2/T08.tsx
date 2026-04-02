'use client';

/**
 * context_menu-mui-v2-T08: Bookmark 4 — Options → Pin to top ON
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import { Check as CheckIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

type OptState = { pinToTop: boolean; showFavicon: boolean; compact: boolean };

export default function T08({ onSuccess }: TaskComponentProps) {
  const [opts, setOpts] = useState<Record<string, OptState>>({
    'Bookmark 1': { pinToTop: false, showFavicon: true, compact: false },
    'Bookmark 2': { pinToTop: false, showFavicon: true, compact: false },
    'Bookmark 3': { pinToTop: false, showFavicon: true, compact: false },
    'Bookmark 4': { pinToTop: false, showFavicon: true, compact: false },
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBm, setActiveBm] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [subMenuAnchor, setSubMenuAnchor] = useState<HTMLElement | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const b4 = opts['Bookmark 4'];

  useEffect(() => {
    if (b4.pinToTop && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [b4.pinToTop, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent, name: string) => {
    event.preventDefault();
    setActiveBm(name);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setSubMenuAnchor(null);
    setAnchorPosition(null);
    setActiveBm(null);
  };

  const togglePin = () => {
    if (!activeBm) return;
    setOpts((prev) => ({
      ...prev,
      [activeBm]: { ...prev[activeBm], pinToTop: !prev[activeBm].pinToTop },
    }));
  };

  return (
    <Paper elevation={2} sx={{ width: 280, p: 1.5 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 13 }}>
        Bookmarks
      </Typography>
      {Object.entries(opts).map(([name, o]) => (
        <Box
          key={name}
          onContextMenu={(e) => handleContextMenu(e, name)}
          sx={{
            p: 1,
            mb: 0.5,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200',
            cursor: 'context-menu',
          }}
          data-testid={`bookmark-${name.replace(/\s/g, '-').toLowerCase()}`}
          data-instance-label={name}
          data-checked-items={JSON.stringify({ 'Pin to top': o.pinToTop })}
        >
          <Typography variant="caption" fontWeight={600}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 10 }}>
            example.com/{name.replace(/\s/g, '').toLowerCase()}
          </Typography>
        </Box>
      ))}

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense onClick={handleClose}>
          Open
        </MenuItem>
        <MenuItem dense onMouseEnter={(e) => setSubMenuAnchor(e.currentTarget)}>
          <Typography sx={{ flex: 1, fontSize: 12 }}>Options</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem dense onClick={handleClose}>
          Remove
        </MenuItem>
      </Menu>

      <Menu
        open={Boolean(subMenuAnchor)}
        anchorEl={subMenuAnchor}
        onClose={() => setSubMenuAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        data-testid="options-submenu"
      >
        {activeBm &&
          (() => {
            const row = opts[activeBm];
            return (
              <>
                <MenuItem dense onClick={togglePin}>
                  {row.pinToTop && (
                    <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <Typography sx={{ pl: row.pinToTop ? 0 : 4 }}>Pin to top</Typography>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() =>
                    setOpts((p) => ({
                      ...p,
                      [activeBm]: { ...p[activeBm], showFavicon: !p[activeBm].showFavicon },
                    }))
                  }
                >
                  {row.showFavicon && (
                    <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <Typography sx={{ pl: row.showFavicon ? 0 : 4 }}>Show favicon</Typography>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() =>
                    setOpts((p) => ({
                      ...p,
                      [activeBm]: { ...p[activeBm], compact: !p[activeBm].compact },
                    }))
                  }
                >
                  {row.compact && (
                    <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <Typography sx={{ pl: row.compact ? 0 : 4 }}>Open in compact mode</Typography>
                </MenuItem>
              </>
            );
          })()}
      </Menu>
    </Paper>
  );
}
