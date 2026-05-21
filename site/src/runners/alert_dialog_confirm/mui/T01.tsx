'use client';

/**
 * alert_dialog_confirm-mui-T01: Confirm deleting a draft (MUI Dialog)
 *
 * Baseline isolated-card layout centered in the viewport. A card titled "Drafts" shows one item "Release Notes (draft)" and a button labeled "Delete draft".
 *
 * Clicking "Delete draft" opens a Material UI Dialog with:
 * - DialogTitle: "Delete this draft?"
 * - DialogContent: short warning text
 * - DialogActions: two buttons: "Cancel" and "Delete" (Delete is the primary/danger action)
 *
 * The dialog closes immediately when either action is clicked.
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
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpen = () => {
    setOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_draft_release_notes',
    };
  };

  const handleConfirm = () => {
    setOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'delete_draft_release_notes',
      };
      onSuccess();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'delete_draft_release_notes',
    };
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Drafts" />
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Release Notes (draft)</span>
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpen}
              data-testid="cb-open-delete-draft"
            >
              Delete draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="delete-dialog-title"
        data-testid="dialog-delete-draft"
      >
        <DialogTitle id="delete-dialog-title">Delete this draft?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. The draft will be permanently removed.
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
