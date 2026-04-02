'use client';

/**
 * toast_snackbar-mui-T07: Dismiss the Secondary snackbar in a two-snackbar stack
 *
 * setup_description:
 * Scene is an isolated card titled "Uploads".
 * Two MUI **Snackbar** instances are already open and stacked vertically at the same anchor position. Each has its own close icon button:
 * 1) Primary snackbar message: "Primary — Upload started"
 * 2) Secondary snackbar message: "Secondary — Upload finished"  ← target
 * The messages are intentionally similar. Only the Secondary snackbar should be dismissed.
 *
 * success_trigger:
 * - The snackbar with message "Secondary — Upload finished" is not visible.
 * - The snackbar with message "Primary — Upload started" remains visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Snackbar, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [primaryOpen, setPrimaryOpen] = useState(true);
  const [secondaryOpen, setSecondaryOpen] = useState(true);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!secondaryOpen && primaryOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [primaryOpen, secondaryOpen, onSuccess]);

  const handlePrimaryClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setPrimaryOpen(false);
  };

  const handleSecondaryClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSecondaryOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Uploads</Typography>
        <Typography variant="body2" color="text.secondary">
          Recent upload activity is shown below.
        </Typography>
      </CardContent>

      {/* Primary snackbar - positioned at bottom left, higher up */}
      <Snackbar
        open={primaryOpen}
        onClose={handlePrimaryClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ bottom: { xs: 90 } }}
        message={<span data-testid="snackbar-message-primary">Primary — Upload started</span>}
        action={
          <IconButton
            size="small"
            aria-label="Close"
            color="inherit"
            onClick={handlePrimaryClose}
            data-testid="snackbar-close-primary"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        data-testid="snackbar-primary"
        data-snackbar-id="primary"
      />

      {/* Secondary snackbar (target) - positioned at bottom left, lower */}
      <Snackbar
        open={secondaryOpen}
        onClose={handleSecondaryClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={<span data-testid="snackbar-message-secondary">Secondary — Upload finished</span>}
        action={
          <IconButton
            size="small"
            aria-label="Close"
            color="inherit"
            onClick={handleSecondaryClose}
            data-testid="snackbar-close-secondary"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        data-testid="snackbar-secondary"
        data-snackbar-id="secondary"
      />
    </Card>
  );
}
