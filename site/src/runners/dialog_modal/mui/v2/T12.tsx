'use client';

/**
 * dialog_modal-mui-v2-T12: Full-screen nested child — Done reviewing
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T12({ onSuccess }: TaskComponentProps) {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const successCalledRef = useRef(false);

  const done = () => {
    setChildOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'done_button',
      modal_instance: 'Focus preview',
      last_opened_instance: 'Focus preview',
      related_instances: { 'Asset review': { open: true } },
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
          <Button variant="contained" onClick={() => setParentOpen(true)} data-testid="cb-start-asset-review">
            Start asset review
          </Button>
        </CardContent>
      </Card>

      <Dialog open={parentOpen} onClose={() => setParentOpen(false)} aria-labelledby="asset-title">
        <DialogTitle id="asset-title">Asset review</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Compare renditions before publishing.
          </Typography>
          <Button variant="outlined" onClick={() => setChildOpen(true)} data-testid="cb-open-focus-preview">
            Open focus preview
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={childOpen}
        fullScreen
        onClose={() => {}}
        disableEscapeKeyDown
        aria-labelledby="focus-title"
      >
        <DialogTitle
          id="focus-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography component="span" variant="h6" sx={{ mr: 'auto' }}>
            Focus preview
          </Typography>
          <Button variant="contained" onClick={done} data-testid="cb-done-reviewing">
            Done reviewing
          </Button>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ height: '60vh', bgcolor: 'action.hover', borderRadius: 1, p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Full-viewport preview canvas (placeholder).
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
