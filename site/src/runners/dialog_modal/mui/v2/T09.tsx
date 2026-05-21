'use client';

/**
 * dialog_modal-mui-v2-T09: Primary token row — loading Reissue now
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<'primary' | 'backup' | null>(null);
  const [loading, setLoading] = useState(false);
  const successCalledRef = useRef(false);

  const openFor = (r: 'primary' | 'backup') => {
    setRow(r);
    setOpen(true);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Reissue token',
      last_opened_instance: 'Reissue token',
    };
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setRow(null);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Reissue token',
      last_opened_instance: 'Reissue token',
    };
  };

  const handleReissue = () => {
    if (row !== 'primary') return;
    setLoading(true);
    window.setTimeout(() => {
      setOpen(false);
      setLoading(false);
      window.__cbModalState = {
        open: false,
        close_reason: 'primary_confirm_button',
        modal_instance: 'Reissue token',
        last_opened_instance: 'Reissue token',
      };
      if (!successCalledRef.current) {
        successCalledRef.current = true;
        setTimeout(() => onSuccess(), 100);
      }
      setRow(null);
    }, 900);
  };

  return (
    <Box sx={{ width: 420 }}>
      <Typography variant="subtitle2" gutterBottom>
        Access
      </Typography>
      <List dense>
        <ListItem
          secondaryAction={
            <Button size="small" onClick={() => openFor('primary')} data-testid="cb-reissue-primary">
              Reissue…
            </Button>
          }
        >
          <ListItemText primary="Primary token" secondary="Rotates API credentials" />
        </ListItem>
        <ListItem
          secondaryAction={
            <Button size="small" onClick={() => openFor('backup')} data-testid="cb-reissue-backup">
              Reissue…
            </Button>
          }
        >
          <ListItemText primary="Backup token" secondary="Failover credential" />
        </ListItem>
      </List>

      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        aria-labelledby="reissue-title"
      >
        <DialogTitle id="reissue-title">Reissue token</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {row === 'primary' && 'Reissue the primary token for this integration.'}
            {row === 'backup' && 'Reissue the backup token for failover.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReissue}
            disabled={loading || row !== 'primary'}
            data-testid="cb-reissue-now"
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Reissue now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
