'use client';

/**
 * alert_dialog_confirm-mui-T05: Scroll to a danger action and cancel the dialog
 *
 * Settings panel layout with a scrollable main content area (the panel itself scrolls). The top contains several harmless sections (Profile, Appearance, Notifications) with toggles and selects.
 *
 * Near the bottom (requires scrolling), there is a "Privacy" section containing a single danger button labeled "Clear search history".
 *
 * Clicking "Clear search history" opens a Material UI Dialog:
 * - Title: "Clear search history?"
 * - Content: "This removes past searches from this device."
 * - Actions: "Cancel" and "Clear"
 *
 * The task requires pressing "Cancel" (explicit cancel) after opening the dialog.
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
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpen = () => {
    setOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'clear_search_history',
    };
  };

  const handleClear = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'clear_search_history',
    };
  };

  const handleCancel = () => {
    setOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'cancel',
        dialog_instance: 'clear_search_history',
      };
      onSuccess();
    }
  };

  return (
    <>
      <Card sx={{ width: 450, maxHeight: 400, overflow: 'auto' }}>
        <CardHeader title="Settings" />
        <CardContent>
          {/* Profile Section */}
          <Typography variant="h6" sx={{ mb: 2 }}>Profile</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Show profile picture" />
          <FormControlLabel control={<Switch />} label="Show email publicly" />
          
          <Divider sx={{ my: 2 }} />

          {/* Appearance Section */}
          <Typography variant="h6" sx={{ mb: 2 }}>Appearance</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Dark mode" />
          <FormControlLabel control={<Switch defaultChecked />} label="Animations" />
          
          <Divider sx={{ my: 2 }} />

          {/* Notifications Section */}
          <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
          <FormControlLabel control={<Switch />} label="Push notifications" />
          <FormControlLabel control={<Switch defaultChecked />} label="Weekly digest" />
          
          <Divider sx={{ my: 2 }} />

          {/* Privacy Section - requires scrolling */}
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>Privacy</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel control={<Switch />} label="Analytics" />
            <FormControlLabel control={<Switch />} label="Personalized ads" />
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpen}
              data-testid="cb-open-clear-history"
              sx={{ mt: 1, alignSelf: 'flex-start' }}
            >
              Clear search history
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="clear-history-dialog-title"
        data-testid="dialog-clear-history"
      >
        <DialogTitle id="clear-history-dialog-title">Clear search history?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes past searches from this device.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleClear} color="error" variant="contained" data-testid="cb-confirm">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
