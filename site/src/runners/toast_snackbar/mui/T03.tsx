'use client';

/**
 * toast_snackbar-mui-T03: Open snackbar: Link copied
 *
 * setup_description:
 * Scene is an isolated card titled "Sharing". The card contains two buttons: "Copy link" (target) and "Copy code" (distractor).
 * Clicking "Copy link" opens a MUI **Snackbar** with message text exactly "Link copied".
 * Clicking "Copy code" produces a different snackbar message ("Code copied").
 * The snackbar auto-hides after a short duration.
 *
 * success_trigger: A snackbar is visible with message text exactly "Link copied".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Stack, Snackbar } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && message === 'Link copied' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, message, onSuccess]);

  const handleCopyLink = () => {
    setMessage('Link copied');
    setOpen(true);
  };

  const handleCopyCode = () => {
    setMessage('Code copied');
    setOpen(true);
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Sharing</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleCopyLink}
            data-testid="copy-link-btn"
          >
            Copy link
          </Button>
          <Button
            variant="outlined"
            onClick={handleCopyCode}
            data-testid="copy-code-btn"
          >
            Copy code
          </Button>
        </Stack>
      </CardContent>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={<span data-testid="snackbar-message">{message}</span>}
        data-testid="snackbar-root"
      />
    </Card>
  );
}
