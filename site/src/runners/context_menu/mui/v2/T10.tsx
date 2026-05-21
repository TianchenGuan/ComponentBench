'use client';

/**
 * context_menu-mui-v2-T10: prod-us-east — Move → Under Archive → As child
 */

import React, { useState } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, ListItemIcon, Chip, Switch, FormControlLabel } from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

const NODES = ['staging', 'prod-us-east', 'prod-us-west', 'archive', 'backup'] as const;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [moveAnchor, setMoveAnchor] = useState<HTMLElement | null>(null);
  const [underAnchor, setUnderAnchor] = useState<HTMLElement | null>(null);
  const [lastPath, setLastPath] = useState<string[] | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const handleContextMenu = (event: React.MouseEvent, node: string) => {
    event.preventDefault();
    setActiveNode(node);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setMoveAnchor(null);
    setUnderAnchor(null);
    setAnchorPosition(null);
    setActiveNode(null);
  };

  const leafClick = (label: string) => {
    const node = activeNode;
    setLastPath(['Move', 'Under Archive', label]);
    if (
      node === 'prod-us-east' &&
      label === 'As child' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 1, maxWidth: 520 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        Rollout
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControlLabel control={<Switch size="small" defaultChecked />} label={<Typography variant="caption">Canary</Typography>} />
        <Chip label="Healthy" size="small" color="success" variant="outlined" sx={{ height: 22 }} />
        <Typography variant="caption" color="text.secondary">
          Last deploy: 14:02
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
          Deployment tree
        </Typography>
        {NODES.map((n, i) => (
          <Box
            key={n}
            onContextMenu={(e) => handleContextMenu(e, n)}
            sx={{
              pl: 1 + i * 0.5,
              py: 0.5,
              cursor: 'context-menu',
              borderRadius: 0.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
            data-testid={`tree-node-${n}`}
            data-instance-label={n}
            data-last-activated-path={
              activeNode === n && lastPath ? lastPath.join(' → ') : undefined
            }
          >
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              {n}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense onMouseEnter={(e) => setMoveAnchor(e.currentTarget)}>
          <Typography sx={{ flex: 1, fontSize: 12 }}>Move</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          dense
          onClick={() => {
            setLastPath(['Rename']);
            handleClose();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          dense
          onClick={() => {
            setLastPath(['Inspect']);
            handleClose();
          }}
        >
          Inspect
        </MenuItem>
      </Menu>

      <Menu
        open={Boolean(moveAnchor)}
        anchorEl={moveAnchor}
        onClose={() => setMoveAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        data-testid="move-submenu"
      >
        <MenuItem dense onMouseEnter={(e) => setUnderAnchor(e.currentTarget)}>
          <Typography sx={{ flex: 1, fontSize: 12 }}>Under Archive</Typography>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      <Menu
        open={Boolean(underAnchor)}
        anchorEl={underAnchor}
        onClose={() => setUnderAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        data-testid="under-archive-submenu"
      >
        <MenuItem dense onClick={() => leafClick('As sibling')}>
          As sibling
        </MenuItem>
        <MenuItem dense onClick={() => leafClick('As child')}>
          As child
        </MenuItem>
      </Menu>
    </Box>
  );
}
