'use client';

/**
 * toast_snackbar-mui-T05: Undo archive via snackbar action: UNDO
 *
 * setup_description:
 * Scene is an isolated card titled "Notes". It contains a primary button labeled "Archive note".
 * Clicking "Archive note" opens a MUI **Snackbar** with message "Note archived". The snackbar includes an action text button labeled "UNDO".
 * Clicking "UNDO" closes the current snackbar and immediately shows a follow-up snackbar with message "Note restored".
 *
 * success_trigger: A snackbar becomes visible with message text exactly "Note restored".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [restoredOpen, setRestoredOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (restoredOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [restoredOpen, onSuccess]);

  const handleArchive = () => {
    setArchiveOpen(true);
  };

  const handleUndo = () => {
    setArchiveOpen(false);
    setRestoredOpen(true);
  };

  const handleArchiveClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setArchiveOpen(false);
  };

  const handleRestoredClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setRestoredOpen(false);
  };

  const archiveAction = (
    <>
      <Button color="primary" size="small" onClick={handleUndo} data-testid="undo-btn">
        UNDO
      </Button>
      <IconButton size="small" aria-label="Close" color="inherit" onClick={handleArchiveClose}>
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
          onClick={handleArchive}
          data-testid="archive-note-btn"
        >
          Archive note
        </Button>
      </CardContent>

      <Snackbar
        open={archiveOpen}
        autoHideDuration={6000}
        onClose={handleArchiveClose}
        message={<span data-testid="snackbar-message-archive">Note archived</span>}
        action={archiveAction}
        data-testid="snackbar-archive"
      />

      <Snackbar
        open={restoredOpen}
        autoHideDuration={4000}
        onClose={handleRestoredClose}
        message={<span data-testid="snackbar-message-restored">Note restored</span>}
        data-testid="snackbar-restored"
      />
    </Card>
  );
}
