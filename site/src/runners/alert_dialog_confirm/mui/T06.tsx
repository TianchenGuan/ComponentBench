'use client';

/**
 * alert_dialog_confirm-mui-T06: Match a dialog to a visual preview (two options)
 *
 * Isolated-card layout centered in the viewport. Two buttons are shown side-by-side:
 * - "Unlink calendar"
 * - "Remove device"
 *
 * Each button opens a Material UI Dialog with similar layout (title, one-paragraph content, actions). Both dialogs use action buttons labeled "Cancel" and "OK".
 * The dialog titles differ and are visible in the header.
 *
 * A separate "Preview" panel on the right displays a static thumbnail image of the *target* dialog (showing its title line and the OK button label). The instruction does not mention which of the two actions is correct—only the preview determines the target.
 *
 * Note: The preview target is "remove_device" dialog
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
  Typography,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [unlinkOpen, setUnlinkOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const successCalledRef = useRef(false);
  const previewTarget = 'remove_device';

  // Store preview target for checker
  if (typeof window !== 'undefined') {
    (window as any).__cbPreviewTarget = previewTarget;
  }

  const handleUnlinkOpen = () => {
    setUnlinkOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'unlink_calendar',
    };
  };

  const handleUnlinkClose = () => {
    setUnlinkOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'unlink_calendar',
    };
  };

  const handleUnlinkConfirm = () => {
    setUnlinkOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'unlink_calendar',
    };
  };

  const handleRemoveOpen = () => {
    setRemoveOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'remove_device',
    };
  };

  const handleRemoveClose = () => {
    setRemoveOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'remove_device',
    };
  };

  const handleRemoveConfirm = () => {
    setRemoveOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'remove_device',
      };
      onSuccess();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {/* Action buttons */}
        <Card sx={{ width: 300 }}>
          <CardHeader title="Actions" />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleUnlinkOpen}
                data-testid="cb-open-unlink-calendar"
              >
                Unlink calendar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveOpen}
                data-testid="cb-open-remove-device"
              >
                Remove device
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Preview card */}
        <Card sx={{ width: 280 }} data-cb-preview-target="remove_device">
          <CardHeader title="Preview" />
          <CardContent>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 2,
                bgcolor: '#fafafa',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Remove this device?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You will need to set it up again.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Box sx={{ px: 1.5, py: 0.5, border: '1px solid #e0e0e0', borderRadius: 1, fontSize: 12 }}>
                  Cancel
                </Box>
                <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'primary.main', color: 'white', borderRadius: 1, fontSize: 12 }}>
                  OK
                </Box>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Match this dialog to complete the task
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Unlink Calendar Dialog */}
      <Dialog
        open={unlinkOpen}
        onClose={handleUnlinkClose}
        aria-labelledby="unlink-dialog-title"
        data-testid="dialog-unlink-calendar"
      >
        <DialogTitle id="unlink-dialog-title">Unlink calendar?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your calendar events will no longer sync.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUnlinkClose} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleUnlinkConfirm} color="primary" variant="contained" data-testid="cb-confirm">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Device Dialog */}
      <Dialog
        open={removeOpen}
        onClose={handleRemoveClose}
        aria-labelledby="remove-dialog-title"
        data-testid="dialog-remove-device"
      >
        <DialogTitle id="remove-dialog-title">Remove this device?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will need to set it up again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveClose} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleRemoveConfirm} color="primary" variant="contained" data-testid="cb-confirm">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
