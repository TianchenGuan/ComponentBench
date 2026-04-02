'use client';

/**
 * dialog_modal-mui-v2-T05: Nested — backdrop dismiss child only, parent stays open
 */

import React, { useState, useRef } from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const successCalledRef = useRef(false);

  const push = (partial: Partial<NonNullable<typeof window.__cbModalState>>) => {
    window.__cbModalState = {
      open: partial.open ?? false,
      close_reason: partial.close_reason ?? null,
      modal_instance: partial.modal_instance ?? null,
      last_opened_instance: partial.last_opened_instance ?? partial.modal_instance ?? null,
      related_instances: partial.related_instances,
    };
  };

  return (
    <>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Button variant="contained" onClick={() => setParentOpen(true)} data-testid="cb-open-settings">
            Open settings
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={parentOpen}
        onClose={(_, reason) => {
          if (childOpen) return;
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') setParentOpen(false);
        }}
        aria-labelledby="settings-title"
      >
        <DialogTitle id="settings-title">Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Automation and workflow defaults.
          </Typography>
          <Button color="error" variant="outlined" onClick={() => setChildOpen(true)} data-testid="cb-delete-automation">
            Delete automation…
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setParentOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={childOpen}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') return;
          setChildOpen(false);
          push({
            open: false,
            close_reason: 'backdrop_click',
            modal_instance: 'Delete automation',
            last_opened_instance: 'Delete automation',
            related_instances: { Settings: { open: true } },
          });
          if (!successCalledRef.current) {
            successCalledRef.current = true;
            setTimeout(() => onSuccess(), 100);
          }
        }}
        disableEscapeKeyDown
        aria-labelledby="del-auto-title"
      >
        <DialogTitle id="del-auto-title">Delete automation</DialogTitle>
        <DialogContent>
          <DialogContentText>This removes the scheduled automation permanently.</DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
