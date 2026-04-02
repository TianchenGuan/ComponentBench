'use client';

/**
 * dialog_modal-mui-T01: Open a basic dialog
 *
 * Layout: isolated_card centered. The page contains one button labeled "Invite members".
 *
 * Clicking the button opens a Material UI Dialog with:
 * - Title: "Invite members"
 * - Content: short static text (no inputs)
 * - Actions row: "Cancel" and "Send invite"
 *
 * Initial state: dialog is closed.
 * Success: The MUI Dialog titled 'Invite members' is open/visible.
 */

import React, { useState, useRef } from 'react';
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

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpen = () => {
    setOpen(true);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Invite members',
    };
    
    // Success when dialog opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Invite members',
    };
  };

  const handleSendInvite = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'ok',
      modal_instance: 'Invite members',
    };
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Team" />
        <CardContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Manage your team members and send invitations.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpen}
            data-testid="cb-open-invite-members"
          >
            Invite members
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="invite-dialog-title"
        data-testid="dialog-invite-members"
      >
        <DialogTitle id="invite-dialog-title">Invite members</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send an invitation to new team members. They will receive an email
            with instructions to join your workspace.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSendInvite} variant="contained">
            Send invite
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
