'use client';

/**
 * password_input-mui-T06: Edit service password in a dialog and save
 * 
 * The page shows a button labeled "Edit credentials". Clicking it opens a Material UI Dialog
 * titled "Edit credentials".
 * Inside the dialog is one password input implemented with MUI OutlinedInput labeled "Service password"
 * (initially empty). The dialog footer contains "Cancel" and "Save" buttons. Clicking Save displays
 * a brief inline confirmation message "Saved" inside the dialog before it closes.
 * No other fields are required.
 * 
 * Success: In the dialog, the "Service password" field equals exactly "Service@3080" AND the
 * "Save" button has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, OutlinedInput, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    if (saved && password === 'Service@3080' && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [saved, password, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setShowSavedMessage(true);
    setTimeout(() => {
      setOpen(false);
      setShowSavedMessage(false);
    }, 500);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Credentials
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        data-testid="edit-credentials-btn"
      >
        Edit credentials
      </Button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        data-testid="edit-credentials-dialog"
      >
        <DialogTitle>Edit credentials</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel htmlFor="service-password">Service password</InputLabel>
            <OutlinedInput
              id="service-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Service password"
              inputProps={{ 'data-testid': 'service-password-input' }}
            />
          </FormControl>
          {showSavedMessage && (
            <Typography color="success.main" sx={{ mt: 1 }}>
              Saved
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} data-testid="dialog-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" data-testid="dialog-save">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
