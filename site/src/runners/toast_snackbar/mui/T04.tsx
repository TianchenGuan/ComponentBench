'use client';

/**
 * toast_snackbar-mui-T04: Dismiss persistent snackbar: You're offline
 *
 * setup_description:
 * Scene is an isolated card titled "Network". The card content is static.
 * A MUI **Snackbar** is already visible when the page loads. It is configured as persistent (autoHideDuration is disabled)
 * and shows message text "You're offline".
 * In the snackbar actions area there is a small icon button with an accessible name "Close" (×). No other snackbars are visible.
 *
 * success_trigger: The snackbar with message "You're offline" is no longer visible (dismissed).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const successCalledRef = useRef(false);
  const wasOpenRef = useRef(true);

  useEffect(() => {
    if (!open && wasOpenRef.current && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="Close"
      color="inherit"
      onClick={handleClose}
      data-testid="snackbar-close-btn"
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Network</Typography>
        <Typography variant="body2" color="text.secondary">
          Connection status is monitored automatically.
        </Typography>
      </CardContent>

      <Snackbar
        open={open}
        onClose={handleClose}
        message={<span data-testid="snackbar-message">You&apos;re offline</span>}
        action={action}
        data-testid="snackbar-root"
        // No autoHideDuration - persistent
      />
    </Card>
  );
}
