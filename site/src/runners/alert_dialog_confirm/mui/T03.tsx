'use client';

/**
 * alert_dialog_confirm-mui-T03: Open a discard-changes dialog and leave it open
 *
 * Baseline isolated-card layout. A card titled "Editor" shows a read-only text preview and a button labeled "Close editor".
 *
 * Clicking "Close editor" opens a Material UI Dialog:
 * - Title: "Discard changes?"
 * - Content: short explanation
 * - Actions: "Keep editing" and "Discard"
 *
 * The task is to open the dialog and keep it open (do not click any action).
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
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
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'discard_changes',
    };
  };

  const handleKeepEditing = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'discard_changes',
    };
  };

  const handleDiscard = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'discard_changes',
    };
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Editor" />
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You have unsaved changes in your document...
          </Typography>
          <Button
            variant="outlined"
            onClick={handleOpen}
            data-testid="cb-open-close-editor"
          >
            Close editor
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleKeepEditing}
        aria-labelledby="discard-dialog-title"
        data-testid="dialog-discard-changes"
      >
        <DialogTitle id="discard-dialog-title">Discard changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. If you close the editor now, your changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleKeepEditing} data-testid="cb-cancel">
            Keep editing
          </Button>
          <Button onClick={handleDiscard} color="error" variant="contained" data-testid="cb-confirm">
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
