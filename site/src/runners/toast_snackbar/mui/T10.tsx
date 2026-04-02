'use client';

/**
 * toast_snackbar-mui-T10: Dismiss one snackbar among three similar failures
 *
 * setup_description:
 * Scene is an isolated card titled "Sync monitor". Global spacing is set to **compact**.
 * Three MUI **Snackbar** instances are visible at load and stacked in the same corner. Each has a close icon button labeled "Close". Their messages are:
 * 1) "Sync failed: timeout"  ← target
 * 2) "Sync failed: token expired"
 * 3) "Sync failed: network"
 * The messages are intentionally similar to test careful selection of the correct snackbar instance.
 *
 * success_trigger:
 * - The snackbar with text "Sync failed: timeout" is not visible.
 * - The snackbars with text "Sync failed: token expired" and "Sync failed: network" remain visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Snackbar, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [timeoutOpen, setTimeoutOpen] = useState(true);
  const [tokenOpen, setTokenOpen] = useState(true);
  const [networkOpen, setNetworkOpen] = useState(true);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!timeoutOpen && tokenOpen && networkOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [timeoutOpen, tokenOpen, networkOpen, onSuccess]);

  const handleTimeoutClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setTimeoutOpen(false);
  };

  const handleTokenClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setTokenOpen(false);
  };

  const handleNetworkClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setNetworkOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Sync monitor</Typography>
        <Typography variant="body2" color="text.secondary">
          Monitoring synchronization status across services.
        </Typography>
      </CardContent>

      {/* Snackbar 1: Sync failed: timeout (target) */}
      <Snackbar
        open={timeoutOpen}
        onClose={handleTimeoutClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: { xs: 144 } }}
        message={<span data-testid="snackbar-message-timeout">Sync failed: timeout</span>}
        action={
          <IconButton
            size="small"
            aria-label="Close"
            color="inherit"
            onClick={handleTimeoutClose}
            data-testid="snackbar-close-timeout"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        data-testid="snackbar-timeout"
      />

      {/* Snackbar 2: Sync failed: token expired */}
      <Snackbar
        open={tokenOpen}
        onClose={handleTokenClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: { xs: 96 } }}
        message={<span data-testid="snackbar-message-token">Sync failed: token expired</span>}
        action={
          <IconButton
            size="small"
            aria-label="Close"
            color="inherit"
            onClick={handleTokenClose}
            data-testid="snackbar-close-token"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        data-testid="snackbar-token"
      />

      {/* Snackbar 3: Sync failed: network */}
      <Snackbar
        open={networkOpen}
        onClose={handleNetworkClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={<span data-testid="snackbar-message-network">Sync failed: network</span>}
        action={
          <IconButton
            size="small"
            aria-label="Close"
            color="inherit"
            onClick={handleNetworkClose}
            data-testid="snackbar-close-network"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        data-testid="snackbar-network"
      />
    </Card>
  );
}
