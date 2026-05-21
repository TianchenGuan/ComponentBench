'use client';

/**
 * dialog_modal-mui-T02: Cancel and close an open dialog
 *
 * Layout: isolated_card centered. A Material UI Dialog is open on page load.
 *
 * Dialog configuration:
 * - Title: "Unsaved changes"
 * - Content: static text warning that changes will be lost.
 * - Actions: two buttons: "Cancel" and "Discard"
 *
 * Initial state: dialog open and focused.
 * Success: The 'Unsaved changes' dialog is closed via Cancel button (close_reason='cancel').
 */

import React, { useState, useRef, useEffect } from 'react';
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

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Dialog starts open
  const [result, setResult] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Unsaved changes',
    };
  }, []);

  const handleCancel = () => {
    setOpen(false);
    setResult('canceled');
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Unsaved changes',
    };
    
    // Success when closed via Cancel
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleDiscard = () => {
    setOpen(false);
    setResult('discarded');
    window.__cbModalState = {
      open: false,
      close_reason: 'ok',
      modal_instance: 'Unsaved changes',
    };
  };

  // Handle backdrop/escape close (should not count as success)
  const handleBackdropClose = (event: object, reason: string) => {
    if (reason === 'backdropClick') {
      setOpen(false);
      setResult('backdrop');
      window.__cbModalState = {
        open: false,
        close_reason: 'mask_click',
        modal_instance: 'Unsaved changes',
      };
    } else if (reason === 'escapeKeyDown') {
      setOpen(false);
      setResult('escape');
      window.__cbModalState = {
        open: false,
        close_reason: 'escape_key',
        modal_instance: 'Unsaved changes',
      };
    }
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Editor" />
        <CardContent>
          <Typography variant="body2">
            Your document editor is ready.
          </Typography>
        </CardContent>
      </Card>

      {result && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Result: {result}
        </Typography>
      )}

      <Dialog
        open={open}
        onClose={handleBackdropClose}
        aria-labelledby="unsaved-dialog-title"
        data-testid="dialog-unsaved-changes"
      >
        <DialogTitle id="unsaved-dialog-title">Unsaved changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. If you leave now, your changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleDiscard} color="error" data-testid="cb-discard">
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
