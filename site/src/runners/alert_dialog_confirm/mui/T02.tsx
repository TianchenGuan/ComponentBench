'use client';

/**
 * alert_dialog_confirm-mui-T02: Cancel signing out (MUI Dialog)
 *
 * Baseline isolated-card layout. A small account card shows user info and a "Sign out" button.
 *
 * Clicking "Sign out" opens a Material UI Dialog:
 * - Title: "Sign out?"
 * - Content: "You will need to sign in again to continue."
 * - Actions: "Cancel" and "Sign out"
 *
 * Task requires explicitly pressing "Cancel" (not dismissing via backdrop/Escape).
 */

import React, { useRef, useState } from 'react';
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
  Avatar,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpen = () => {
    setOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'sign_out',
    };
  };

  const handleConfirm = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'sign_out',
    };
  };

  const handleCancel = () => {
    setOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'cancel',
        dialog_instance: 'sign_out',
      };
      onSuccess();
    }
  };

  const handleDismiss = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'dismiss',
      dialog_instance: 'sign_out',
    };
  };

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardHeader title="Account" />
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Avatar>JD</Avatar>
            <div>
              <Typography variant="subtitle1">John Doe</Typography>
              <Typography variant="body2" color="text.secondary">john@example.com</Typography>
            </div>
          </div>
          <Button
            variant="outlined"
            onClick={handleOpen}
            data-testid="cb-open-sign-out"
          >
            Sign out
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleDismiss}
        aria-labelledby="signout-dialog-title"
        data-testid="dialog-sign-out"
      >
        <DialogTitle id="signout-dialog-title">Sign out?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will need to sign in again to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" data-testid="cb-confirm">
            Sign out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
