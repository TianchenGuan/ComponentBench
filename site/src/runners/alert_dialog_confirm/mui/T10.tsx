'use client';

/**
 * alert_dialog_confirm-mui-T10: Confirm delete account from inside a modal flow (nested overlays)
 *
 * Modal-flow layout. When the page loads, a parent "Account details" modal is already open (this outer modal is NOT the target component; it is a container).
 *
 * Inside the Account details modal:
 * - Several read-only fields and buttons (distractors)
 * - A "Danger Zone" section with a button labeled "Delete account"
 *
 * Clicking "Delete account" opens a second overlay: a Material UI Dialog (confirm dialog) above the parent modal with:
 * - Title: "Delete account?"
 * - Content: warning text
 * - Actions: "Cancel" and "Delete"
 *
 * The task is to confirm deletion by clicking "Delete" in the confirmation dialog. Success depends only on the confirmation dialog action/state, not on the outer modal.
 */

import React, { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Divider,
  Box,
  TextField,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [parentOpen] = useState(true); // Parent modal is always open
  const [confirmOpen, setConfirmOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_account',
    };
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'delete_account',
      };
      onSuccess();
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'delete_account',
    };
  };

  return (
    <>
      {/* Parent modal (Account details) - always open */}
      <Dialog
        open={parentOpen}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        aria-labelledby="account-details-dialog-title"
        data-testid="dialog-account-details"
      >
        <DialogTitle id="account-details-dialog-title">Account details</DialogTitle>
        <DialogContent>
          {/* Read-only fields (distractors) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              label="Email"
              value="user@example.com"
              size="small"
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Username"
              value="johndoe"
              size="small"
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Member since"
              value="January 2024"
              size="small"
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Danger Zone */}
          <Typography variant="subtitle2" color="error" sx={{ mb: 2 }}>
            Danger Zone
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleOpenConfirm}
            data-testid="cb-open-delete-account"
          >
            Delete account
          </Button>
        </DialogContent>
        <DialogActions>
          <Button disabled>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog (nested) */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancel}
        aria-labelledby="delete-account-dialog-title"
        data-testid="dialog-delete-account"
        sx={{ zIndex: 1400 }} // Higher z-index than parent
      >
        <DialogTitle id="delete-account-dialog-title">Delete account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete your account and all associated data. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained" data-testid="cb-confirm">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
