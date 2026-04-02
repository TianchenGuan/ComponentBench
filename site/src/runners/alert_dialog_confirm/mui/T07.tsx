'use client';

/**
 * alert_dialog_confirm-mui-T07: Confirm removing a device (dark theme)
 *
 * Isolated-card layout with a dark theme applied to the page and components.
 *
 * A card titled "Trusted devices" lists one device: "Pixel Tablet" with a button labeled "Remove device".
 *
 * Clicking the button opens a Material UI Dialog:
 * - Title: "Remove Pixel Tablet?"
 * - Content: "You may need to sign in again on this device."
 * - Actions: "Cancel" and "Remove" (Remove is styled as the primary/danger action)
 *
 * Dialog closes immediately on action.
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import TabletIcon from '@mui/icons-material/Tablet';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpen = () => {
    setOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'remove_device_pixel_tablet',
    };
  };

  const handleConfirm = () => {
    setOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'remove_device_pixel_tablet',
      };
      onSuccess();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'remove_device_pixel_tablet',
    };
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Trusted devices" />
        <CardContent>
          <List>
            <ListItem>
              <TabletIcon sx={{ mr: 2 }} />
              <ListItemText primary="Pixel Tablet" secondary="Last active: Today" />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleOpen}
                  data-testid="cb-open-remove-device"
                >
                  Remove device
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="remove-device-dialog-title"
        data-testid="dialog-remove-device"
      >
        <DialogTitle id="remove-device-dialog-title">Remove Pixel Tablet?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You may need to sign in again on this device.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained" data-testid="cb-confirm">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
