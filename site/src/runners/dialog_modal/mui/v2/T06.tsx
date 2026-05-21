'use client';

/**
 * dialog_modal-mui-v2-T06: Nested — Escape closes child only
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
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const successCalledRef = useRef(false);

  const dismissChild = () => {
    setChildOpen(false);
    if (parentOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Button variant="contained" onClick={() => setParentOpen(true)} data-testid="cb-open-filters">
            Open filters
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={parentOpen}
        onClose={(_, reason) => {
          if (childOpen) return;
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') setParentOpen(false);
        }}
        aria-labelledby="filters-title"
      >
        <DialogTitle id="filters-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Filters
          <IconButton size="small" onClick={() => { if (!childOpen) setParentOpen(false); }} aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Draft filters are not saved until you apply.
          </Typography>
          <Button variant="outlined" onClick={() => setChildOpen(true)} data-testid="cb-discard-draft">
            Discard draft…
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={childOpen}
        onClose={(_, reason) => {
          if (reason === 'backdropClick') return;
          dismissChild();
        }}
        disableEscapeKeyDown={false}
        aria-labelledby="discard-title"
      >
        <DialogTitle id="discard-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Discard draft
          <IconButton size="small" onClick={dismissChild} aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Unsaved filter changes will be lost.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dismissChild}>Keep editing</Button>
          <Button color="error" onClick={() => { setChildOpen(false); setParentOpen(false); }}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
