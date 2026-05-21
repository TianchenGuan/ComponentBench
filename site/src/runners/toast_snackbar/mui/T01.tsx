'use client';

/**
 * toast_snackbar-mui-T01: Open basic Snackbar: Note archived
 *
 * setup_description:
 * Scene is an isolated card titled "Notes". The card contains a single button labeled "Open Snackbar".
 * Clicking the button sets the MUI **Snackbar** open. The snackbar appears floating above the UI with message text exactly "Note archived".
 * It includes an actions area (e.g., UNDO button and a close icon), but no action is required for success.
 * The snackbar auto-hides after a short duration.
 *
 * success_trigger: A snackbar toast is visible with message text exactly "Note archived".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const action = (
    <>
      <Button color="primary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton size="small" aria-label="Close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Notes</Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          data-testid="open-snackbar-btn"
        >
          Open Snackbar
        </Button>
      </CardContent>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={<span data-testid="snackbar-message">Note archived</span>}
        action={action}
        data-testid="snackbar-root"
      />
    </Card>
  );
}
