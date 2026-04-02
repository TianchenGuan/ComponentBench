'use client';

/**
 * context_menu-mui-v2-T09: Cache shard 2 — Purge cache… → Cancel
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

const SHARDS = ['Cache shard 1', 'Cache shard 2', 'Cache shard 3'] as const;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeShard, setActiveShard] = useState<string | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelledForShard, setCancelledForShard] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (cancelledForShard === 'Cache shard 2' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [cancelledForShard, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent, shard: string) => {
    event.preventDefault();
    setActiveShard(shard);
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
    setShowConfirm(false);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setShowConfirm(false);
    setAnchorPosition(null);
    setActiveShard(null);
  };

  return (
    <Dialog open maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: 'grey.900', color: 'grey.100' } }}>
      <DialogTitle sx={{ fontSize: 16 }}>Server maintenance</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {['Live', 'Staging', 'Alerts', 'Queue depth: 12'].map((c) => (
            <Chip key={c} label={c} size="small" sx={{ height: 22, fontSize: 10, bgcolor: 'grey.800' }} />
          ))}
        </Box>
        {SHARDS.map((shard) => (
          <Paper
            key={shard}
            elevation={0}
            onContextMenu={(e) => handleContextMenu(e, shard)}
            sx={{
              p: 1,
              mb: 0.5,
              bgcolor: 'grey.800',
              cursor: 'context-menu',
              border: '1px solid',
              borderColor: 'grey.700',
            }}
            data-testid={`shard-${shard.replace(/\s/g, '-').toLowerCase()}`}
            data-instance-label={shard}
            data-confirmation-result={cancelledForShard === shard ? 'cancelled' : undefined}
            data-cancelled-action-path={cancelledForShard === shard ? 'Purge cache' : undefined}
          >
            <Typography variant="caption" fontWeight={600}>
              {shard}
            </Typography>
            <Typography variant="caption" color="grey.500" sx={{ display: 'block', fontSize: 10 }}>
              hit ratio 94% · 2m ago
            </Typography>
          </Paper>
        ))}

        <Menu
          open={menuOpen}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition ?? undefined}
          data-testid="context-menu-overlay"
        >
          <MenuItem dense onClick={handleClose} disabled={showConfirm}>
            Copy shard ID
          </MenuItem>
          <MenuItem dense onClick={handleClose} disabled={showConfirm}>
            Open metrics
          </MenuItem>
          <Divider />
          <MenuItem dense onClick={() => setShowConfirm(true)} disabled={showConfirm} data-testid="purge-item">
            Purge cache…
          </MenuItem>
          {showConfirm && (
            <>
              <Divider />
              <Box sx={{ px: 2, py: 1 }} data-testid="confirm-footer">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WarningIcon color="warning" fontSize="small" />
                  <Typography variant="caption">Purge {activeShard}?</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => {
                      if (activeShard) setCancelledForShard(activeShard);
                      handleClose();
                    }}
                    data-testid="cancel-purge-button"
                  >
                    Cancel
                  </Button>
                  <Button size="small" variant="contained" color="error" onClick={handleClose}>
                    Purge
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Menu>
      </DialogContent>
    </Dialog>
  );
}
