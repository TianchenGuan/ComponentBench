'use client';

/**
 * text_input-mui-T09: Update status message in dialog and save
 * 
 * Scene uses a modal_flow: a centered profile card shows a read-only line "Current status: Available" and a
 * button labeled "Edit status message". Clicking the button opens a MUI Dialog containing a single MUI
 * TextField labeled "Status message", pre-filled with "Available". The dialog footer has two buttons: "Cancel"
 * and "Save". The read-only status line on the card updates only after clicking Save. No other text inputs
 * exist in either the background card or the dialog.
 * 
 * Success: The TextField labeled "Status message" is set to "In a meeting" (trim whitespace), the change is
 * committed by clicking the "Save" button (not Cancel), and the background "Current status" preview shows
 * "In a meeting".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Available');
  const [savedStatus, setSavedStatus] = useState('Available');

  useEffect(() => {
    if (savedStatus.trim() === 'In a meeting') {
      onSuccess();
    }
  }, [savedStatus, onSuccess]);

  const handleSave = () => {
    setSavedStatus(statusMessage);
    setOpen(false);
  };

  const handleCancel = () => {
    setStatusMessage(savedStatus);
    setOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile
          </Typography>
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Current status:
            </Typography>
            <Typography data-testid="current-status" id="current-status">
              {savedStatus}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={() => setOpen(true)}
            data-testid="edit-status-btn"
          >
            Edit status message
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Edit status message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Status message"
            fullWidth
            variant="outlined"
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            inputProps={{ 'data-testid': 'status-message-input' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
