'use client';

/**
 * toast_snackbar-mui-T02: Show snackbar: Settings saved
 *
 * setup_description:
 * Scene is an isolated card titled "Settings". The card contains a primary button labeled "Save settings"
 * and a secondary button labeled "Reset" (does not show a snackbar).
 * Clicking "Save settings" shows a MUI **Snackbar** with message text exactly "Settings saved".
 * The snackbar auto-hides after a normal duration.
 *
 * success_trigger: A snackbar is visible with message text exactly "Settings saved".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Stack, Snackbar } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleSave = () => {
    setOpen(true);
  };

  const handleReset = () => {
    // Distractor - does nothing related to snackbar
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            data-testid="save-settings-btn"
          >
            Save settings
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            data-testid="reset-btn"
          >
            Reset
          </Button>
        </Stack>
      </CardContent>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={<span data-testid="snackbar-message">Settings saved</span>}
        data-testid="snackbar-root"
      />
    </Card>
  );
}
