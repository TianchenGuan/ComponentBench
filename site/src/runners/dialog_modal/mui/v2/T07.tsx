'use client';

/**
 * dialog_modal-mui-v2-T07: Nested — header × closes child only
 */

import React, { useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const successCalledRef = useRef(false);

  const closeChildByIcon = () => {
    setChildOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_icon',
      modal_instance: 'Details',
      last_opened_instance: 'Details',
      related_instances: { 'Layout settings': { open: true } },
    };
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Button variant="contained" onClick={() => setParentOpen(true)} data-testid="cb-open-layout-settings">
            Open layout settings
          </Button>
        </CardContent>
      </Card>

      <Dialog open={parentOpen} onClose={() => setParentOpen(false)} aria-labelledby="layout-title">
        <DialogTitle id="layout-title">Layout settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Grid density and column widths.
          </Typography>
          <Button variant="outlined" onClick={() => setChildOpen(true)} data-testid="cb-open-details">
            Open details
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={childOpen}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        }}
        aria-labelledby="details-title"
      >
        <DialogTitle
          id="details-title"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          Details
          <IconButton aria-label="close" onClick={closeChildByIcon} size="small" data-testid="cb-details-close-icon">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Fine-grained layout metrics for this workspace.</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
